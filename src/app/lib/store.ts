"use client";

import { useState, useEffect, useCallback } from 'react';
import { DeviceRecord } from './types';

const STORAGE_KEY = 'serviceflow_devices';

export function useDeviceStore() {
  const [records, setRecords] = useState<DeviceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored records", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records, isLoaded]);

  const addRecord = (record: Omit<DeviceRecord, 'id' | 'entryDate' | 'status'>) => {
    const newRecord: DeviceRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      entryDate: new Date().toISOString(),
      status: 'Active',
    };
    setRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const archiveRecord = (id: string) => {
    setRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Archived', archivedDate: new Date().toISOString() } : r
    ));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const clearArchive = () => {
    setRecords(prev => prev.filter(r => r.status !== 'Archived'));
  };

  const findByBarcode = useCallback((barcode: string) => {
    const cleanBarcode = barcode.trim();
    // نبحث عن الجهاز في القائمة النشطة أولاً
    return records.find(r => r.barcode.trim() === cleanBarcode && r.status === 'Active');
  }, [records]);

  const getActiveRecords = () => records.filter(r => r.status === 'Active');
  const getArchivedRecords = () => records.filter(r => r.status === 'Archived');

  return {
    records,
    isLoaded,
    addRecord,
    archiveRecord,
    deleteRecord,
    clearArchive,
    getActiveRecords,
    getArchivedRecords,
    findByBarcode
  };
}
