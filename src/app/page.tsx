"use client";

import React, { useState } from 'react';
import { useDeviceStore } from '@/app/lib/store';
import { Scanner } from '@/components/Scanner';
import { ServiceForm } from '@/components/ServiceForm';
import { Dashboard } from '@/components/Dashboard';
import { Archive } from '@/components/Archive';
import { Reports } from '@/components/Reports';
import { 
  ScanBarcode, 
  LayoutDashboard, 
  History, 
  BarChart3, 
  ChevronRight, 
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AppSection = 'Scanner' | 'Dashboard' | 'Archive' | 'Reports';

export default function Home() {
  const [activeSection, setActiveSection] = useState<AppSection>('Dashboard');
  const [showForm, setShowForm] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [lookupDevice, setLookupDevice] = useState<any>(null);
  const { toast } = useToast();
  
  const { 
    records, 
    isLoaded, 
    addRecord, 
    archiveRecord, 
    findByBarcode 
  } = useDeviceStore();

  const handleScan = (barcode: string) => {
    const existing = findByBarcode(barcode);
    if (existing) {
      setLookupDevice(existing);
      toast({
        title: "Device Identified",
        description: `Found active service for ${existing.deviceName}.`,
      });
    } else {
      setScannedBarcode(barcode);
      setShowForm(true);
    }
  };

  const onFormSubmit = (data: any) => {
    addRecord(data);
    setShowForm(false);
    setScannedBarcode(null);
    setActiveSection('Dashboard');
    toast({
      title: "Service Recorded",
      description: "The device has been added to the active queue.",
    });
  };

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Scanner', icon: ScanBarcode, label: 'New Scan' },
    { id: 'Archive', icon: History, label: 'Archive' },
    { id: 'Reports', icon: BarChart3, label: 'Reports' },
  ] as const;

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading ServiceFlow...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ScanBarcode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">ServiceFlow</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Repair Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setLookupDevice(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
              {activeSection !== item.id && item.id === 'Dashboard' && records.filter(r => r.status === 'Active').length > 0 && (
                <span className="ml-auto w-5 h-5 bg-primary/10 text-primary text-[10px] rounded-full flex items-center justify-center font-bold">
                  {records.filter(r => r.status === 'Active').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t">
          <Card className="bg-accent/5 border-none shadow-none">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-accent mb-2">Ready to work?</p>
              <Button 
                className="w-full h-9 bg-accent hover:bg-accent/90 text-xs"
                onClick={() => {
                  setScannedBarcode(null);
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Manual Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-foreground">{activeSection}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-500 gap-2 border">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Scanner Ready
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-auto p-8 bg-[#F0F2F5]/50">
          <div className="max-w-6xl mx-auto">
            {/* View Switching */}
            {activeSection === 'Scanner' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Barcode Terminal</h2>
                  <p className="text-muted-foreground">Identify devices or create new service tickets instantly.</p>
                </div>
                <Scanner onScan={handleScan} />
                
                {lookupDevice && (
                  <Card className="border-primary/50 bg-primary/5 shadow-lg animate-in zoom-in-95">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
                            <CheckCircle className="w-10 h-10" />
                          </div>
                          <div>
                            <Badge className="mb-2 bg-primary/20 text-primary border-none">Active Record Found</Badge>
                            <h3 className="text-2xl font-bold">{lookupDevice.deviceName}</h3>
                            <p className="text-muted-foreground font-mono text-sm">{lookupDevice.barcode}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setLookupDevice(null)}>
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-b py-6">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Customer</p>
                          <p className="font-medium">{lookupDevice.customerName}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Service Type</p>
                          <p className="font-medium text-accent">{lookupDevice.serviceType}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Current Status</p>
                          <p className="font-medium text-primary">In Progress</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => {
                            archiveRecord(lookupDevice.id);
                            setLookupDevice(null);
                            setActiveSection('Archive');
                            toast({
                              title: "Device Handed Over",
                              description: "The service has been completed and archived.",
                            });
                          }}
                        >
                          Complete Handover
                        </Button>
                        <Button variant="outline" onClick={() => setActiveSection('Dashboard')}>
                          View in Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeSection === 'Dashboard' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Service Overview</h2>
                  <p className="text-muted-foreground">Manage active device queues and service flows.</p>
                </div>
                <Dashboard 
                  records={records} 
                  onArchive={(id) => {
                    archiveRecord(id);
                    toast({
                      title: "Archived",
                      description: "The device has been moved to the archive.",
                    });
                  }} 
                />
              </div>
            )}

            {activeSection === 'Archive' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Records & History</h2>
                  <p className="text-muted-foreground">Browse all completed services and historical device data.</p>
                </div>
                <Archive records={records} />
              </div>
            )}

            {activeSection === 'Reports' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Business Insights</h2>
                  <p className="text-muted-foreground">Analyze performance statistics and service distribution.</p>
                </div>
                <Reports records={records} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Service Entry Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Service Request</DialogTitle>
          </DialogHeader>
          <ServiceForm 
            initialBarcode={scannedBarcode || ''} 
            onSubmit={onFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setScannedBarcode(null);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}