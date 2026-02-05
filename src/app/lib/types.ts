export type ServiceType = 'Charging' | 'Maintenance' | 'Software';

export interface DeviceRecord {
  id: string;
  barcode: string;
  deviceName: string;
  customerName: string;
  serviceType: ServiceType;
  description: string;
  entryDate: string;
  status: 'Active' | 'Archived';
  archivedDate?: string;
}

export type NewDeviceRecord = Omit<DeviceRecord, 'id' | 'entryDate' | 'status'>;