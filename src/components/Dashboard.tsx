
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BatteryCharging, Settings, Code, Archive, User, Calendar, Smartphone, Box, CheckCircle2 } from 'lucide-react';
import { DeviceRecord } from '@/app/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardProps {
  records: DeviceRecord[];
  onArchive: (id: string) => void;
}

export function Dashboard({ records, onArchive }: DashboardProps) {
  const activeRecords = records.filter(r => r.status === 'Active');
  
  const charging = activeRecords.filter(r => r.serviceType === 'Charging');
  const maintenance = activeRecords.filter(r => r.serviceType === 'Maintenance');
  const software = activeRecords.filter(r => r.serviceType === 'Software');

  const categories = [
    { id: 'Maintenance', label: 'صيانة هاردوير', icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50', list: maintenance },
    { id: 'Charging', label: 'شحن الهاتف', icon: BatteryCharging, color: 'text-orange-500', bg: 'bg-orange-50', list: charging },
    { id: 'Software', label: 'برمجة / سوفت', icon: Code, color: 'text-primary', bg: 'bg-green-50', list: software },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="Maintenance" className="w-full">
        <TabsList className="grid grid-cols-3 h-14 bg-gray-100/50 p-1.5 rounded-[1.5rem] mb-6 backdrop-blur-sm">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id} 
              className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all font-black text-xs md:text-sm"
            >
              <cat.icon className={cn("w-4 h-4 ml-2", cat.color)} />
              {cat.label}
              {cat.list.length > 0 && (
                <span className="mr-2 bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {cat.list.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4 outline-none">
            {cat.list.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 glass-card rounded-[2.5rem] border-dashed border-2 border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-[1.5rem] flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-500">لا توجد أجهزة</h3>
                <p className="text-xs text-gray-400 mt-1">القائمة فارغة حالياً لقسم {cat.label}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cat.list.map((record) => (
                  <Card key={record.id} className="glass-card rounded-[2rem] overflow-hidden group hover:scale-[1.01] transition-all border-none relative shadow-md">
                    <div className="flex">
                      <div className={cn("w-2", cat.bg.replace('50', '500'))} />
                      <div className="flex-1 p-6 text-right">
                        <div className="flex justify-between items-start mb-4">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-black h-10 px-4 transition-all"
                            onClick={() => onArchive(record.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 ml-2" />
                            إتمام وتسليم
                          </Button>
                          <div className="text-right">
                            <div className="flex flex-row-reverse items-center gap-2 mb-1">
                              <h3 className="font-black text-xl text-gray-800">{record.deviceName}</h3>
                              <Badge className="bg-gray-100 text-gray-600 border-none font-mono text-[10px] rounded-lg">
                                {record.barcode}
                              </Badge>
                            </div>
                            <div className="flex flex-row-reverse items-center gap-4 text-[10px] text-muted-foreground font-bold">
                              <span className="flex items-center gap-1"><User className="w-3 h-3 ml-1" /> {record.customerName}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 ml-1" /> {format(new Date(record.entryDate), 'hh:mm a')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {record.description && (
                          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                            <p className="text-xs text-gray-600 leading-relaxed font-bold">
                              {record.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
