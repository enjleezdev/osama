
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Keyboard, Search, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ScannerProps {
  onScan: (barcode: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'فشل الوصول إلى الكاميرا',
          description: 'يرجى تفعيل صلاحيات الكاميرا في إعدادات المتصفح لاستخدام هذه الميزة.',
        });
      }
    };

    if (isScanning) {
      getCameraPermission();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning, toast]);

  const handleStartScanning = () => {
    setIsScanning(true);
    // محاكاة اكتشاف الباركود بعد 3 ثوانٍ من تشغيل الكاميرا
    setTimeout(() => {
      setIsScanning(false);
      const mockBarcode = 'SRV-' + Math.floor(1000 + Math.random() * 9000);
      onScan(mockBarcode);
    }, 3500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-2xl bg-white shadow-sm hover:border-primary/50 transition-all cursor-pointer group overflow-hidden min-h-[300px]"
          onClick={!isScanning ? handleStartScanning : undefined}
        >
          {isScanning ? (
            <div className="w-full h-full relative flex flex-col items-center">
              <video 
                ref={videoRef} 
                className="w-full aspect-video rounded-md bg-black object-cover" 
                autoPlay 
                muted 
                playsInline
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-red-500/50 shadow-[0_0_15px_red] animate-pulse" />
                <div className="mt-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  جاري البحث عن باركود...
                </div>
              </div>
              
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/95 z-10">
                  <Alert variant="destructive">
                    <AlertTitle>مطلوب الوصول إلى الكاميرا</AlertTitle>
                    <AlertDescription>
                      يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح لمسح الأجهزة.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ScanBarcode className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">امسح الباركود</h3>
              <p className="text-gray-500 text-center mt-3 max-w-[240px]">
                انقر هنا لفتح الكاميرا ومسح رمز الجهاز تلقائياً
              </p>
              <Badge className="mt-6 px-4 py-1" variant="secondary">جاهز للمسح الذكي</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Keyboard className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold text-gray-800">إدخال يدوي</h3>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-5">
            <div className="relative">
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="أدخل رمز الباركود يدوياً" 
                className="pr-10 h-14 text-lg"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-14 bg-accent hover:bg-accent/90 text-lg font-bold" disabled={!manualBarcode.trim()}>
              بدء البحث
            </Button>
          </form>

          <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm leading-relaxed border border-blue-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>عند مسح باركود مسجل مسبقاً، سيتم عرض بيانات الجهاز فوراً. الباركودات الجديدة ستقوم بفتح نموذج تسجيل خدمة جديد.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
