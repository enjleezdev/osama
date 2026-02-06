"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Keyboard, Search, AlertCircle, X, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface ScannerProps {
  onScan: (barcode: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  const lastResultRef = useRef<string>("");
  const consecutiveMatchesRef = useRef<number>(0);
  const REQUIRED_MATCHES = 2; 

  useEffect(() => {
    if (isScanning) {
      const startScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;

          const config = {
            fps: 20, 
            qrbox: { width: 280, height: 180 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.CODE_39,
            ]
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              if (decodedText === lastResultRef.current) {
                consecutiveMatchesRef.current += 1;
              } else {
                lastResultRef.current = decodedText;
                consecutiveMatchesRef.current = 1;
              }

              if (consecutiveMatchesRef.current >= REQUIRED_MATCHES) {
                onScan(decodedText);
                stopScanning();
                setIsScanning(false);
                toast({
                  title: "تم التعرف بنجاح ✨",
                  description: `الرمز المستخرج: ${decodedText}`,
                });
                lastResultRef.current = "";
                consecutiveMatchesRef.current = 0;
              }
            },
            () => {}
          );
          setHasCameraPermission(true);
        } catch (err) {
          console.error("Camera error", err);
          setHasCameraPermission(false);
          setIsScanning(false);
        }
      };

      startScanner();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isScanning]);

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Stop error", err);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Scanner Card */}
        <div 
          className={`relative overflow-hidden rounded-[3rem] glass-card min-h-[400px] flex flex-col transition-all duration-500 ${
            isScanning ? 'ring-4 ring-primary ring-offset-8' : 'hover:scale-[1.02] cursor-pointer shadow-xl'
          }`}
          onClick={!isScanning ? () => setIsScanning(true) : undefined}
        >
          {isScanning ? (
            <div className="w-full h-full relative flex flex-col">
              <div id="reader" className="w-full h-full min-h-[400px]" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsScanning(false);
                }}
                className="absolute top-4 right-4 z-40 rounded-full h-10 w-10 bg-black/40 text-white hover:bg-black/60 shadow-2xl transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Holographic Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <div className="w-72 h-44 border-2 border-primary/50 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-10 h-10 border-t-8 border-l-8 border-primary rounded-tl-2xl"></div>
                  <div className="absolute -top-1 -right-1 w-10 h-10 border-t-8 border-r-8 border-primary rounded-tr-2xl"></div>
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-8 border-l-8 border-primary rounded-bl-2xl"></div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-8 border-r-8 border-primary rounded-br-2xl"></div>
                  
                  <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                  <div className="w-full h-1.5 bg-gradient-to-t from-red-600 via-red-500 to-red-400 absolute top-0 shadow-[0_0_20px_rgba(239,68,68,1)] animate-[scan_2s_infinite]"></div>
                </div>
                
                <div className="mt-12 flex flex-col items-center gap-3">
                  <div className="bg-primary px-6 py-2 rounded-full text-white text-xs font-black shadow-2xl flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current animate-bounce" />
                    المسح الذكي نشط
                  </div>
                  <p className="text-white text-xs font-bold drop-shadow-md">ضع الباركود داخل الإطار المضيء</p>
                </div>
              </div>

              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-white/95 z-40 backdrop-blur-md">
                  <Alert variant="destructive" className="rounded-3xl p-6 border-none shadow-2xl">
                    <ShieldCheck className="w-8 h-8 mb-4" />
                    <AlertTitle className="text-right text-lg font-black">الكاميرا معطلة</AlertTitle>
                    <AlertDescription className="text-right font-bold mt-2">
                      يرجى السماح بالوصول من إعدادات المتصفح لإتمام عملية المسح.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
              <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8 animate-float">
                <ScanBarcode className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-gray-800">تشغيل الكاميرا</h3>
              <p className="text-muted-foreground font-bold mt-2 max-w-[200px]">
                استخدم كاميرا الهاتف لمسح الأكواد بسرعة ودقة
              </p>
              <div className="mt-8">
                <Badge className="bg-primary/20 text-primary border-none px-6 py-2 rounded-full font-black text-xs">نظام التحقق المزدوج 100%</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry Section */}
        <div className="glass-card p-10 rounded-[3rem] border-none shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
              <Keyboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-800">إدخال يدوي</h3>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="أدخل رمز الباركود" 
                className="pr-14 h-16 rounded-2xl border-none bg-gray-100/50 text-lg font-black text-right focus-visible:ring-primary shadow-inner"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-16 bg-accent hover:bg-accent/90 text-white text-lg font-black rounded-2xl shadow-xl shadow-accent/20 transition-all active:scale-95"
              disabled={!manualBarcode.trim()}
            >
              بحث في النظام
            </Button>
          </form>

          <div className="mt-8 flex items-start gap-4 p-5 bg-blue-50/50 text-blue-700 rounded-3xl text-sm border border-blue-100/50 text-right font-bold leading-relaxed">
            <AlertCircle className="w-6 h-6 shrink-0 text-blue-500" />
            <p>لنتائج أدق، تأكد من نظافة عدسة الكاميرا وتوفر إضاءة جيدة حول الجهاز.</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
