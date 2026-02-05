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
  CheckCircle,
  X,
  Plus,
  Menu
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type AppSection = 'Scanner' | 'Dashboard' | 'Archive' | 'Reports';

export default function Home() {
  const [activeSection, setActiveSection] = useState<AppSection>('Dashboard');
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

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { id: 'Scanner', icon: ScanBarcode, label: 'مسح باركود' },
    { id: 'Archive', icon: History, label: 'الأرشيف' },
    { id: 'Reports', icon: BarChart3, label: 'التقارير' },
  ] as const;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center gap-2 mb-10 px-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <ScanBarcode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">ServiceFlow</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">مركز الصيانة</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
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
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t px-4">
        <Card className="bg-accent/5 border-none shadow-none">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-accent mb-2 text-right">إضافة يدوية؟</p>
            <Button 
              className="w-full h-9 bg-accent hover:bg-accent/90 text-xs"
              onClick={() => {
                setScannedBarcode(null);
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              إدخال بيانات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#F0F2F5]/50 text-foreground flex flex-col md:flex-row overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-72">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
              <span className="hidden sm:inline">الرئيسية</span>
              <ChevronRight className="w-3 h-3 hidden sm:inline" />
              <span className="font-semibold text-foreground">{navItems.find(n => n.id === activeSection)?.label}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center px-3 py-1.5 bg-green-100 rounded-full text-[10px] md:text-xs text-green-700 gap-1.5 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden xs:inline">الماسح جاهز</span>
            </div>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            {activeSection === 'Scanner' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-right">محطة الباركود</h2>
                  <p className="text-muted-foreground text-sm text-right">قم بمسح الجهاز للتعرف عليه أو إنشاء تذكرة جديدة.</p>
                </div>
                <Scanner onScan={handleScan} />
              </div>
            )}

            {activeSection === 'Dashboard' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 text-right">
                  <h2 className="text-xl md:text-2xl font-bold">نظرة عامة على الخدمات</h2>
                  <p className="text-muted-foreground text-sm">إدارة قائمة الأجهزة النشطة وحالة الصيانة.</p>
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
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 text-right">
                  <h2 className="text-xl md:text-2xl font-bold">السجلات والتاريخ</h2>
                  <p className="text-muted-foreground text-sm">استعرض جميع الخدمات المكتملة وتاريخ تسليم الأجهزة.</p>
                </div>
                <Archive records={records} />
              </div>
            )}

            {activeSection === 'Reports' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 text-right">
                  <h2 className="text-xl md:text-2xl font-bold">رؤى الأعمال</h2>
                  <p className="text-muted-foreground text-sm">تحليل إحصائيات الأداء وتوزيع الخدمات.</p>
                </div>
                <Reports records={records} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Service Entry Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="w-[95vw] max-w-md p-0 overflow-hidden border-none shadow-2xl">
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
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <Badge className="mb-2 bg-white text-primary font-bold border-none">سجل نشط موجود</Badge>
                  <h3 className="text-2xl font-bold text-center">{lookupDevice.deviceName}</h3>
                  <p className="font-mono text-sm opacity-80">{lookupDevice.barcode}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">العميل</p>
                    <p className="font-semibold text-sm">{lookupDevice.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">نوع الخدمة</p>
                    <p className="font-semibold text-sm text-accent">{lookupDevice.serviceType}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-dashed">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">تفاصيل المشكلة</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{lookupDevice.description}</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-bold"
                    onClick={() => {
                      archiveRecord(lookupDevice.id);
                      setShowDetailsDialog(false);
                      setActiveSection('Archive');
                      toast({
                        title: "تم تسليم الجهاز",
                        description: "تم إكمال الخدمة ونقلها للأرشيف بنجاح.",
                      });
                    }}
                  >
                    إتمام التسليم والأرشفة
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setActiveSection('Dashboard');
                    }}
                  >
                    عرض في لوحة التحكم
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
