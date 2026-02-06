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
  History, 
  BarChart3, 
  CheckCircle,
  X,
  Plus,
  ArrowRight,
  Baby,
  Cpu,
  Smartphone,
  Zap,
  ShieldCheck
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

type AppSection = 'Menu' | 'Scanner' | 'Archive' | 'Reports';

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
        title: "جهاز معروف ✅",
        description: `تم العثور على سجل لـ ${existing.deviceName}`,
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
    setActiveSection('Menu');
    toast({
      title: "تم التسجيل بنجاح",
      description: "الجهاز الآن في قائمة المهام النشطة.",
    });
  };

  if (!isLoaded) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white gap-6 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse-slow"></div>
        <Baby className="w-24 h-24 text-primary relative z-10 animate-crawl" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-3xl font-bold text-primary tracking-widest drop-shadow-sm">شيل الصبر...</p>
        <div className="h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_2s_infinite]"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  const activeCount = records.filter(r => r.status === 'Active').length;

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col selection:bg-primary/30 font-body">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-accent/5 blur-[120px]"></div>
      </div>

      <header className="h-20 glass-card px-6 flex items-center justify-between sticky top-0 z-50 rounded-b-[2rem] mx-auto w-full max-w-2xl mt-0 shadow-lg">
        <div className="flex items-center gap-3">
          {activeSection !== 'Menu' && (
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => setActiveSection('Menu')}
              className="rounded-2xl hover:scale-110 transition-transform bg-gray-100/50"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          )}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black text-primary leading-tight">أســــــــامه</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">لخدمات الموبايل</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">الحالة</span>
            <span className="text-xs text-green-600 font-bold">النظام جاهز</span>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Zap className="w-5 h-5 fill-current animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-6 pb-24">
        {activeSection === 'Menu' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Hero Section / Action Center */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[3rem] group-hover:bg-primary/30 transition-all"></div>
              <button 
                onClick={() => setActiveSection('Scanner')}
                className="relative w-full aspect-video md:aspect-[21/9] bg-primary rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 animate-float">
                  <ScanBarcode className="w-10 h-10 text-white" />
                </div>
                <div className="text-center z-10">
                  <h2 className="text-2xl font-black text-white">امسح الباركود</h2>
                  <p className="text-white/70 text-sm font-bold mt-1">ابدأ استقبال جهاز جديد فوراً</p>
                </div>
                
                {/* Visual scanning line */}
                <div className="absolute left-0 right-0 h-[2px] bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-[scan_3s_infinite] pointer-events-none"></div>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-5 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full group-hover:scale-150 transition-transform"></div>
                  <Cpu className="w-6 h-6 text-primary relative z-10" />
                  <span className="text-3xl font-black text-gray-800">{activeCount}</span>
                  <span className="text-xs text-muted-foreground font-bold">أجهزة قيد العمل</span>
               </div>
               <div className="glass-card p-5 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/10 rounded-full group-hover:scale-150 transition-transform"></div>
                  <Smartphone className="w-6 h-6 text-accent relative z-10" />
                  <span className="text-3xl font-black text-gray-800">{records.length}</span>
                  <span className="text-xs text-muted-foreground font-bold">إجمالي السجلات</span>
               </div>
            </div>

            {/* Active Workspace */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  لوحة العمل الحالية
                </h3>
              </div>
              <Dashboard 
                records={records} 
                onArchive={(id) => {
                  archiveRecord(id);
                  toast({
                    title: "تم الإنجاز ✅",
                    description: "نقل الجهاز إلى الأرشيف.",
                  });
                }} 
              />
            </div>

            {/* Bottom Grid Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveSection('Archive')}
                className="glass-card h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6" />
                </div>
                <span className="text-sm font-black">الأرشيف</span>
              </button>
              
              <button
                onClick={() => setActiveSection('Reports')}
                className="glass-card h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-sm font-black">التقارير</span>
              </button>
            </div>

            {/* Quick Entry Callout */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-gradient-to-r from-accent/10 to-transparent border-accent/20">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">إضافة يدوية</h4>
                    <p className="text-xs text-muted-foreground">بدون الحاجة لمسح الباركود</p>
                  </div>
               </div>
               <Button 
                onClick={() => {
                  setScannedBarcode(null);
                  setShowForm(true);
                }}
                className="rounded-2xl bg-white text-accent hover:bg-white/80 border border-accent/20 font-black px-6"
               >
                 ابدأ
               </Button>
            </div>
          </div>
        )}

        {/* Dynamic Section Content */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {activeSection === 'Scanner' && <Scanner onScan={handleScan} />}
          {activeSection === 'Archive' && <Archive records={records} />}
          {activeSection === 'Reports' && <Reports records={records} />}
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t bg-white/50 backdrop-blur-sm rounded-t-[3rem]">
        <p className="text-sm text-gray-500 font-bold flex flex-col items-center gap-2">
          <span>تصميم وتطوير بكل ❤️ بواسطة</span>
          <a 
            href="https://enjleez.cloud/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-600 transition-all font-black text-lg underline-offset-8 hover:underline"
          >
            enjleez cloud
          </a>
        </p>
      </footer>

      {/* Modern Dialogs */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-none shadow-2xl p-8">
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[92vw] max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[3rem]">
          {lookupDevice && (
            <div className="bg-white">
              <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="absolute left-6 top-6 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
                <div className="flex flex-col items-center mt-6 relative z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mb-4 backdrop-blur-md border border-white/30 animate-float">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <Badge className="mb-2 bg-white text-primary font-black px-4 py-1 rounded-full border-none shadow-xl">سجل نشط</Badge>
                  <h3 className="text-2xl font-black text-center">{lookupDevice.deviceName}</h3>
                  <code className="bg-black/20 px-3 py-1 rounded-lg text-xs font-mono mt-2">{lookupDevice.barcode}</code>
                </div>
              </div>
              
              <div className="p-8 space-y-6 text-right">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">العميل</p>
                    <p className="font-black text-base">{lookupDevice.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">نوع الخدمة</p>
                    <p className="font-black text-base text-primary">{lookupDevice.serviceType}</p>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-[1.5rem] border border-dashed border-gray-200">
                  <p className="text-[10px] uppercase text-muted-foreground font-black mb-2 tracking-widest">ملاحظات الفني</p>
                  <p className="text-sm text-gray-700 leading-relaxed font-bold">{lookupDevice.description || 'لا توجد ملاحظات إضافية'}</p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 h-16 text-lg font-black rounded-[1.5rem] shadow-xl shadow-primary/20"
                    onClick={() => {
                      archiveRecord(lookupDevice.id);
                      setShowDetailsDialog(false);
                      setActiveSection('Archive');
                      toast({
                        title: "تم التسليم بنجاح ✨",
                        description: "تم نقل السجل إلى الأرشيف.",
                      });
                    }}
                  >
                    إتمام وتسليم الجهاز
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 text-sm rounded-[1.5rem] font-black text-gray-400"
                    onClick={() => setShowDetailsDialog(false)}
                  >
                    إغلاق التفاصيل
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}