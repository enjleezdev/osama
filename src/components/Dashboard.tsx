"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BatteryCharging, Settings, Code, Archive, ChevronRight, User, Calendar, Tag } from 'lucide-react';
import { DeviceRecord, ServiceType } from '@/app/lib/types';
import { format } from 'date-fns';

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
    { name: 'Charging', count: charging.length, icon: BatteryCharging, color: 'text-orange-500', bg: 'bg-orange-50', list: charging },
    { name: 'Maintenance', count: maintenance.length, icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50', list: maintenance },
    { name: 'Software', count: software.length, icon: Code, color: 'text-[#23b936]', bg: 'bg-green-50', list: software },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{cat.name} Services</CardTitle>
              <cat.icon className={`w-5 h-5 ${cat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cat.count}</div>
              <p className="text-xs text-muted-foreground mt-1">Devices currently in queue</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="Charging" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-white/50 p-1 border border-gray-200">
          {categories.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="space-y-4 outline-none">
            {cat.list.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-dashed text-center">
                <cat.icon className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No {cat.name} Devices</h3>
                <p className="text-sm text-gray-400 mt-1">Devices scanned for {cat.name.toLowerCase()} will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cat.list.map((record) => (
                  <Card key={record.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="flex">
                      <div className={`w-2 ${cat.color.startsWith('text-[#') ? 'bg-[#23b936]' : cat.color.replace('text', 'bg')}`} />
                      <div className="flex-1 p-6 text-right">
                        <div className="flex flex-row-reverse justify-between items-start mb-4">
                          <div className="text-right">
                            <div className="flex flex-row-reverse items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{record.deviceName}</h3>
                              <Badge variant="outline" className="font-mono">{record.barcode}</Badge>
                            </div>
                            <div className="flex flex-row-reverse items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex flex-row-reverse items-center gap-1"><User className="w-3 h-3 ml-1" /> {record.customerName}</span>
                              <span className="flex flex-row-reverse items-center gap-1"><Calendar className="w-3 h-3 ml-1" /> {format(new Date(record.entryDate), 'MMM d, h:mm a')}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-accent hover:bg-accent/10 flex-row-reverse"
                            onClick={() => onArchive(record.id)}
                          >
                            <Archive className="w-4 h-4 ml-1" />
                            إتمام وأرشفة
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-3 rounded-md border text-right">
                          {record.description}
                        </p>
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