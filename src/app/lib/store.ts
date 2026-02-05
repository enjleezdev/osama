"use client";

import { useState, useEffect } from 'react';
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

  const getActiveRecords = () => records.filter(r => r.status === 'Active');
  const getArchivedRecords = () => records.filter(r => r.status === 'Archived');
  
  const findByBarcode = (barcode: string) => {
    return records.find(r => r.barcode === barcode && r.status === 'Active');
  };

  return {
    records,
    isLoaded,
    addRecord,
    archiveRecord,
    getActiveRecords,
    getArchivedRecords,
    findByBarcode
  };
}