"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Keyboard, Search, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScannerProps {
  onScan: (barcode: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSimulation = () => {
    setIsScanning(true);
    // Simulate a scanner delay
    setTimeout(() => {
      const mockBarcode = 'SRV-' + Math.floor(1000 + Math.random() * 9000);
      onScan(mockBarcode);
      setIsScanning(false);
    }, 1200);
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
          className="relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/30 rounded-2xl bg-white shadow-sm hover:border-primary/50 transition-all cursor-pointer group"
          onClick={handleScanSimulation}
        >
          {isScanning ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <ScanBarcode className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-primary">Scanning Barcode...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ScanBarcode className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Smart Scan</h3>
              <p className="text-gray-500 text-center mt-2 max-w-[200px]">
                Click to simulate hardware scanner trigger
              </p>
              <Badge className="mt-4" variant="secondary">Camera Integration Ready</Badge>
            </>
          )}
          {/* Simulated Scanner Line Animation */}
          {isScanning && (
            <div className="absolute left-4 right-4 top-1/2 h-1 bg-red-500/50 shadow-[0_0_10px_red] animate-[bounce_1s_infinite]" />
          )}
        </div>

        <div className="flex flex-col justify-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Keyboard className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-gray-800">Manual Entry</h3>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Enter Barcode ID manually" 
                className="pl-10 h-12"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-accent hover:bg-accent/90" disabled={!manualBarcode.trim()}>
              Proceed to Lookup
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Scanning an existing barcode will instantly retrieve the device details. New barcodes will open the Service Request form.</p>
          </div>
        </div>
      </div>
    </div>
  );
}