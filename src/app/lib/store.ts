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
  orderBy,
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

  // 1. مراقبة حالة تسجيل الدخول (التعرف على المستخدم)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. متابعة التغييرات في قاعدة البيانات (فقط البيانات الخاصة بهذا المستخدم)
  useEffect(() => {
    if (!currentUser) {
      if (isLoaded) setRecords([]); // مسح البيانات إذا سجل خروج
      return;
    }

    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', currentUser.uid),
      orderBy('entryDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRecords = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as DeviceRecord[];
      
      setRecords(updatedRecords);
      setIsLoaded(true);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [currentUser, isLoaded]);

  const addRecord = async (record: Omit<DeviceRecord, 'id' | 'entryDate' | 'status' | 'userId'>) => {
    if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً");
    
    try {
      const newRecordData = {
        ...record,
        userId: currentUser.uid,
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
    isLoaded: isLoaded && !!currentUser,
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