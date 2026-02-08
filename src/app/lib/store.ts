
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DeviceRecord } from './types';

const STORAGE_KEY = 'osama_mobile_records';

export function useDeviceStore() {
  const [records, setRecords] = useState<DeviceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // 1. تحميل البيانات من localStorage فوراً عند البدء (Offline First)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    setIsLoaded(true);
    
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        syncWithSupabase();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // المزامنة الأولية إذا كان متصلاً
      if (navigator.onLine) {
        syncWithSupabase();
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // 2. دالة المزامنة مع Supabase (جلب أحدث البيانات)
  const syncWithSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('entryDate', { ascending: false });

      if (error) throw error;

      if (data) {
        setRecords(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  // 3. إضافة سجل جديد (محلي + محاولة سحابية)
  const addRecord = async (record: Omit<DeviceRecord, 'id' | 'entryDate' | 'status' | 'userId'>) => {
    const newRecord: DeviceRecord = {
      ...record,
      id: crypto.randomUUID(),
      userId: 'anonymous_user', 
      entryDate: new Date().toISOString(),
      status: 'Active',
    };

    // التحديث المحلي الفوري (عشان يظهر في الشاشة فوراً)
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    // المحاولة في السحاب إذا كان متصلاً
    if (navigator.onLine) {
      try {
        await supabase.from('devices').insert([newRecord]);
      } catch (e) {
        console.error("Cloud insert failed, will sync later:", e);
      }
    }

    return newRecord;
  };

  // 4. أرشفة سجل
  const archiveRecord = async (id: string) => {
    const updatedRecords = records.map(r => 
      r.id === id ? { ...r, status: 'Archived' as const, archivedDate: new Date().toISOString() } : r
    );
    
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine) {
      try {
        await supabase
          .from('devices')
          .update({ status: 'Archived', archivedDate: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.error("Cloud update failed:", e);
      }
    }
  };

  // 5. حذف سجل
  const deleteRecord = async (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine) {
      try {
        await supabase.from('devices').delete().eq('id', id);
      } catch (e) {
        console.error("Cloud delete failed:", e);
      }
    }
  };

  const clearArchive = async () => {
    const updatedRecords = records.filter(r => r.status !== 'Archived');
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine) {
      try {
        await supabase.from('devices').delete().eq('status', 'Archived');
      } catch (e) {
        console.error("Cloud clear failed:", e);
      }
    }
  };

  const findByBarcode = useCallback((barcode: string) => {
    return records.find(r => r.barcode.trim() === barcode.trim() && r.status === 'Active');
  }, [records]);

  return {
    records,
    isLoaded,
    isOnline,
    addRecord,
    archiveRecord,
    deleteRecord,
    clearArchive,
    findByBarcode
  };
}
