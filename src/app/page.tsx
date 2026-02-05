
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
  ChevronLeft, 
  CheckCircle,
  X,
  Plus,
  ArrowRight
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

type AppSection = 'Menu' | 'Scanner' | 'Dashboard' | 'Archive' | 'Reports';

export default function Home() {
  const [activeSection, setActiveSection] = useState<AppSection>('Menu');
  const [showForm, setShowForm] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
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
      setShowDetailsDialog(true);
      toast({
        title: "تم التعرف على الجهاز",
        description: `تم العثور على سجل نشط لـ ${existing.deviceName}.`,
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
      title: "تم تسجيل الخدمة",
      description: "تمت إضافة الجهاز إلى قائمة الانتظار النشطة.",
    });
  };

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'لوحة التحكم', color: 'bg-blue-500' },
    { id: 'Scanner', icon: ScanBarcode, label: 'ماسح الباركود', color: 'bg-primary' },
    { id: 'Archive', icon: History, label: 'الأرشيف', color: 'bg-orange-500' },
    { id: 'Reports', icon: BarChart3, label: 'التقارير', color: 'bg-purple-500' },
  ] as const;

  if (!isLoaded) return <div className="flex h-screen items-center justify-center font-bold">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-foreground flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Header Bar */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50 w-full shrink-0">
        <div className="flex items-center gap-2">
          {activeSection !== 'Menu' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveSection('Menu')}
              className="mr-1"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-primary">OSAMA TECH</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center px-2 py-1 bg-green-50 rounded-full text-[10px] text-green-700 gap-1 border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>متصل</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden p-4">
        <div className="max-w-md mx-auto space-y-6">
          
          {activeSection === 'Menu' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main Scan Action */}
              <div className="space-y-4 pt-2">
                <Button 
                  className="w-full h-24 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveSection('Scanner')}
                >
                  <ScanBarcode className="w-8 h-8" />
                  <span className="text-lg font-bold">امسح الباركود</span>
                </Button>
                
                <p className="text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">التنقل السريع</p>
              </div>

              {/* 2x2 Navigation Grid */}
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="aspect-square bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-3 p-4 group"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Manual Entry Quick Action */}
              <Card className="bg-accent/5 border-none shadow-none rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">إضافة يدوية؟</p>
                    <p className="text-[10px] text-muted-foreground">أدخل البيانات بدون مسح</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-accent hover:bg-accent/90 rounded-xl"
                    onClick={() => {
                      setScannedBarcode(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    إدخال جديد
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'Scanner' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-right">
                <h2 className="text-xl font-bold">ماسح الباركود</h2>
                <p className="text-muted-foreground text-sm">وجه الكاميرا نحو الكود</p>
              </div>
              <Scanner onScan={handleScan} />
            </div>
          )}

          {activeSection === 'Dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-right">
                <h2 className="text-xl font-bold">نظرة عامة على الخدمات</h2>
                <p className="text-muted-foreground text-sm">الأجهزة النشطة حالياً</p>
              </div>
              <Dashboard 
                records={records} 
                onArchive={(id) => {
                  archiveRecord(id);
                  toast({
                    title: "تم الأرشفة",
                    description: "تم نقل الجهاز إلى سجل الأرشيف بنجاح.",
                  });
                }} 
              />
            </div>
          )}

          {activeSection === 'Archive' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-right">
                <h2 className="text-xl font-bold">الأرشيف</h2>
                <p className="text-muted-foreground text-sm">سجل العمليات المكتملة</p>
              </div>
              <Archive records={records} />
            </div>
          )}

          {activeSection === 'Reports' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-right">
                <h2 className="text-xl font-bold">التقارير</h2>
                <p className="text-muted-foreground text-sm">إحصائيات الأداء</p>
              </div>
              <Reports records={records} />
            </div>
          )}
        </div>
      </main>

      {/* New Service Entry Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right">طلب صيانة جديد</DialogTitle>
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

      {/* Device Details Popup (Found Record) */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[92vw] max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          {lookupDevice && (
            <div className="bg-white">
              <div className="bg-primary p-6 text-white relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="absolute left-4 top-4 text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="flex flex-col items-center mt-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm border border-white/30">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <Badge className="mb-2 bg-white text-primary font-bold border-none">سجل نشط</Badge>
                  <h3 className="text-xl font-bold text-center">{lookupDevice.deviceName}</h3>
                  <p className="font-mono text-xs opacity-80">{lookupDevice.barcode}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">العميل</p>
                    <p className="font-semibold text-sm">{lookupDevice.customerName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">نوع الخدمة</p>
                    <p className="font-semibold text-sm text-accent">{lookupDevice.serviceType}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-dashed">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">الوصف</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{lookupDevice.description}</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-sm font-bold rounded-xl"
                    onClick={() => {
                      archiveRecord(lookupDevice.id);
                      setShowDetailsDialog(false);
                      setActiveSection('Archive');
                      toast({
                        title: "تم تسليم الجهاز",
                        description: "تم إكمال الخدمة بنجاح.",
                      });
                    }}
                  >
                    إتمام التسليم والأرشفة
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-xs rounded-xl"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setActiveSection('Dashboard');
                    }}
                  >
                    عرض التفاصيل الكاملة
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
