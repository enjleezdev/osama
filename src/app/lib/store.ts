
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DeviceRecord } from './types';

const STORAGE_KEY = 'osama_mobile_records';
const DEVICE_ID_KEY = 'osama_mobile_device_id';

export function useDeviceStore() {
  const [records, setRecords] = useState<DeviceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // الحصول على أو إنشاء بصمة الجهاز الفريدة
  const getOrCreateDeviceId = () => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  };

  const syncWithSupabase = async (currentDeviceId: string) => {
    if (!navigator.onLine || supabase.supabaseUrl === 'invalid') return;

    try {
      // جلب البيانات الخاصة بهذا الجهاز فقط
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('userId', currentDeviceId)
        .order('entryDate', { ascending: false });

      if (!error && data) {
        setRecords(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Supabase sync skipped due to connection.");
    }
  };

  useEffect(() => {
    const currentId = getOrCreateDeviceId();
    setDeviceId(currentId);

    // تحميل البيانات المحلية فوراً للسرعة
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    setIsLoaded(true);
    
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        syncWithSupabase(currentId);
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // محاولة المزامنة الأولية إذا كان متصلاً
      if (navigator.onLine) {
        syncWithSupabase(currentId);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const addRecord = async (record: Omit<DeviceRecord, 'id' | 'entryDate' | 'status' | 'userId'>) => {
    const currentId = deviceId || getOrCreateDeviceId();
    const newRecord: DeviceRecord = {
      ...record,
      id: crypto.randomUUID(),
      userId: currentId, 
      entryDate: new Date().toISOString(),
      status: 'Active',
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    // الرفع للسحاب في الخلفية إذا كان متصلاً
    if (navigator.onLine && supabase.supabaseUrl !== 'invalid') {
      try {
        await supabase.from('devices').insert([newRecord]);
      } catch (e) {
        console.error("Cloud saving failed, data kept locally.");
      }
    }

    return newRecord;
  };

  const archiveRecord = async (id: string) => {
    const archivedDate = new Date().toISOString();
    const updatedRecords = records.map(r => 
      r.id === id ? { ...r, status: 'Archived' as const, archivedDate } : r
    );
    
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine && supabase.supabaseUrl !== 'invalid') {
      try {
        await supabase
          .from('devices')
          .update({ status: 'Archived', archivedDate })
          .eq('id', id);
      } catch (e) {
        console.error("Cloud update failed.");
      }
    }
  };

  const deleteRecord = async (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine && supabase.supabaseUrl !== 'invalid') {
      try {
        await supabase.from('devices').delete().eq('id', id);
      } catch (e) {
        console.error("Cloud delete failed.");
      }
    }
  };

  const clearArchive = async () => {
    const updatedRecords = records.filter(r => r.status !== 'Archived');
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    if (navigator.onLine && supabase.supabaseUrl !== 'invalid') {
      try {
        await supabase.from('devices').delete().eq('status', 'Archived').eq('userId', deviceId);
      } catch (e) {
        console.error("Cloud clear failed.");
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
