"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { DeviceRecord } from './types';

const COLLECTION_NAME = 'devices';

export function useDeviceStore() {
  const [records, setRecords] = useState<DeviceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // التحقق الفوري من المستخدم الحالي (يعمل أوفلاين إذا كان مسجلاً سابقاً)
    if (auth.currentUser) {
      setCurrentUser(auth.currentUser);
    }
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        // إذا لم يكن هناك مستخدم، نعتبر المحمل انتهى لنعرض واجهة فارغة أو تسجيل الدخول
        setIsLoaded(true);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRecords = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as DeviceRecord[];
      
      // الترتيب محلياً لتجنب مشاكل الفهرسة (Indexes) في البداية
      const sortedRecords = updatedRecords.sort((a, b) => 
        new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
      );
      
      setRecords(sortedRecords);
      setIsLoaded(true);
    }, (error) => {
      console.error("Firestore Offline Error:", error);
      // حتى لو فشل الاتصال، نعتبره "محمل" ليعرض ما في الذاكرة المحلية
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addRecord = async (record: Omit<DeviceRecord, 'id' | 'entryDate' | 'status' | 'userId'>) => {
    const user = currentUser || auth.currentUser;
    if (!user) throw new Error("يجب تسجيل الدخول أولاً");
    
    try {
      const newRecordData = {
        ...record,
        userId: user.uid,
        entryDate: new Date().toISOString(),
        status: 'Active' as const,
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecordData);
      return { id: docRef.id, ...newRecordData };
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const archiveRecord = async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'Archived',
        archivedDate: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error archiving document: ", e);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const clearArchive = async () => {
    try {
      const archivedRecords = records.filter(r => r.status === 'Archived');
      const batch = writeBatch(db);
      
      archivedRecords.forEach(record => {
        batch.delete(doc(db, COLLECTION_NAME, record.id));
      });
      
      await batch.commit();
    } catch (e) {
      console.error("Error clearing archive: ", e);
    }
  };

  const findByBarcode = useCallback((barcode: string) => {
    const cleanBarcode = barcode.trim();
    return records.find(r => r.barcode.trim() === cleanBarcode && r.status === 'Active');
  }, [records]);

  const getActiveRecords = () => records.filter(r => r.status === 'Active');
  const getArchivedRecords = () => records.filter(r => r.status === 'Archived');

  return {
    records,
    isLoaded: isLoaded, // إظهار المحتوى بمجرد اكتمال الفحص الأولي
    addRecord,
    archiveRecord,
    deleteRecord,
    clearArchive,
    getActiveRecords,
    getArchivedRecords,
    findByBarcode,
    userId: currentUser?.uid
  };
}
