
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Keyboard, Search, AlertCircle, XCircle } from 'lucide-react';
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

  useEffect(() => {
    if (isScanning) {
      const startScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ]
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              // النجاح في المسح
              onScan(decodedText);
              stopScanning();
              toast({
                title: "تم المسح بنجاح",
                description: `الرمز المستخرج: ${decodedText}`,
              });
            },
            (errorMessage) => {
              // أخطاء التتبع (يمكن تجاهلها عادة لأنها تحدث باستمرار أثناء البحث عن باركود)
            }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-white shadow-sm transition-all overflow-hidden min-h-[400px] ${
            isScanning ? 'border-primary' : 'border-primary/30 hover:border-primary/50 cursor-pointer'
          }`}
          onClick={!isScanning ? handleStartScanning : undefined}
        >
          {isScanning ? (
            <div className="w-full h-full relative flex flex-col items-center">
              <div id="reader" className="w-full h-full min-h-[400px]" />
              
              <div className="absolute top-4 right-4 z-20">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsScanning(false);
                  }}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-40 border-2 border-primary/50 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-md"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-md"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-md"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-md"></div>
                  <div className="w-full h-0.5 bg-primary/40 absolute top-1/2 -translate-y-1/2 animate-bounce"></div>
                </div>
                <div className="mt-8 bg-black/60 text-white px-6 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  ضع الباركود داخل الإطار للمسح
                </div>
              </div>
              
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/95 z-30">
                  <Alert variant="destructive">
                    <AlertTitle>مطلوب الوصول إلى الكاميرا</AlertTitle>
                    <AlertDescription>
                      يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح لمسح الأجهزة بشكل حقيقي.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
                <ScanBarcode className="w-14 h-14 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">امسح الباركود</h3>
              <p className="text-gray-500 text-center mt-3 max-w-[280px]">
                انقر هنا لفتح الكاميرا وقراءة الرموز الحقيقية من أجهزتك
              </p>
              <div className="mt-8 flex gap-2">
                <Badge className="px-4 py-1.5" variant="secondary">Code 128</Badge>
                <Badge className="px-4 py-1.5" variant="secondary">QR Code</Badge>
                <Badge className="px-4 py-1.5" variant="secondary">EAN-13</Badge>
              </div>
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
            <p>الماسح الضوئي يدعم الآن قراءة الرموز الحقيقية. تأكد من وجود إضاءة كافية عند مسح الباركود من هاتفك أو الملصقات.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
