"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Keyboard, Search, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';
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
            fps: 15, 
            qrbox: { width: 280, height: 160 },
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
                // تأكيد سريع جداً
                toast({
                  title: "تم المسح بنجاح",
                  description: `الرمز: ${decodedText}`,
                });
                lastResultRef.current = "";
                consecutiveMatchesRef.current = 0;
              }
            },
            () => {}
          );
          setHasCameraPermission(true);
        } catch (err) {
          console.error("Unable to start scanning", err);
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
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const handleStartScanning = () => {
    lastResultRef.current = "";
    consecutiveMatchesRef.current = 0;
    setIsScanning(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-white shadow-sm transition-all overflow-hidden min-h-[350px] md:min-h-[420px] ${
            isScanning ? 'border-primary' : 'border-primary/30 hover:border-primary/50 cursor-pointer'
          }`}
          onClick={!isScanning ? handleStartScanning : undefined}
        >
          {isScanning ? (
            <div className="w-full h-full relative flex flex-col items-center">
              <div id="reader" className="w-full h-full min-h-[350px]" />
              
              <div className="absolute top-4 left-4 z-20">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsScanning(false);
                  }}
                  className="rounded-full h-10 w-10 p-0 shadow-lg"
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="w-[80%] h-32 md:w-72 md:h-44 border-2 border-primary rounded-lg relative shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-md"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-md"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-md"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-md"></div>
                  <div className="w-full h-1 bg-primary absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-pulse"></div>
                </div>
                
                <div className="mt-4 md:mt-8 flex flex-col items-center gap-2">
                  <div className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-[10px] md:text-sm font-bold backdrop-blur-md flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 md:w-4 h-4" />
                    وضع الدقة نشط
                  </div>
                </div>
              </div>
              
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/95 z-30">
                  <Alert variant="destructive">
                    <AlertTitle className="text-right font-bold">مطلوب الوصول إلى الكاميرا</AlertTitle>
                    <AlertDescription className="text-right">
                      يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
                <ScanBarcode className="w-10 h-10 md:w-14 md:h-14 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">امسح الباركود</h3>
              <p className="text-gray-500 text-center mt-2 px-6 text-sm md:text-md">
                قم بتوجيه الكاميرا نحو الكود الحقيقي الخاص بك
              </p>
              <div className="mt-6">
                <Badge className="px-4 py-1.5 bg-green-50 text-green-700 border-green-200" variant="outline">نظام التحقق نشط</Badge>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Keyboard className="w-5 h-5 text-accent" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">إدخال يدوي</h3>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="أدخل الرمز هنا" 
                className="pr-10 h-12 md:h-14 text-md md:text-lg text-right"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12 md:h-14 bg-accent hover:bg-accent/90 text-md md:text-lg font-bold" disabled={!manualBarcode.trim()}>
              بدء البحث
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-[12px] md:text-sm leading-relaxed border border-blue-100 text-right">
            <p className="w-full">لضمان أفضل نتيجة، ثبّت الجهاز جيداً وتأكد من أن الباركود يقع تماماً داخل الإطار.</p>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
