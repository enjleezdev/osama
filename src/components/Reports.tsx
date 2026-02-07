"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { DeviceRecord } from '@/app/lib/types';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';

interface ReportsProps {
  records: DeviceRecord[];
}

export function Reports({ records }: ReportsProps) {
  const stats = useMemo(() => {
    const categories = {
      'شحن': records.filter(r => r.serviceType === 'Charging').length,
      'صيانة': records.filter(r => r.serviceType === 'Maintenance').length,
      'برمجة': records.filter(r => r.serviceType === 'Software').length,
    };

    const statusData = [
      { name: 'نشط', value: records.filter(r => r.status === 'Active').length },
      { name: 'مؤرشف', value: records.filter(r => r.status === 'Archived').length },
    ];

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    
    return { categoryData, statusData, total: records.length, archivedCount: statusData[1].value };
  }, [records]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg rounded-[2rem]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm opacity-90 font-black">إجمالي الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.total}</div>
            <div className="flex items-center text-xs mt-2 gap-1 font-bold opacity-80">
              <TrendingUp className="w-3 h-3" />
              حجم العمل الكلي
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md rounded-[2rem] glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-black">عملاء مميزون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-800">{new Set(records.map(r => r.customerName)).size}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2 gap-1 font-bold">
              <Users className="w-3 h-3" />
              إجمالي قاعدة العملاء
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-[2rem] glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-black">تم التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-800">{stats.archivedCount}</div>
            <div className="flex items-center text-xs text-green-600 mt-2 gap-1 font-black">
              <CheckCircle2 className="w-3 h-3" />
              تم الإنجاز والتسليم
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-[2rem] glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-black">متوسط الإنجاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-800">1.2 يوم</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2 gap-1 font-bold">
              <Clock className="w-3 h-3" />
              زمن الاستجابة التقريبي
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-xl rounded-[2.5rem] glass-card">
          <CardHeader className="px-0 pt-0 text-right">
            <CardTitle className="font-black text-xl">فئات الخدمة</CardTitle>
            <CardDescription className="font-bold">توزيع حجم العمل عبر أنواع الخدمات</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-6">
            <ChartContainer config={{ 
              value: { label: 'حجم الخدمة', color: 'hsl(var(--primary))' }
            }}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="font-bold" />
                <YAxis axisLine={false} tickLine={false} className="font-bold" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-xl rounded-[2.5rem] glass-card">
          <CardHeader className="px-0 pt-0 text-right">
            <CardTitle className="font-black text-xl">حالة الإنجاز</CardTitle>
            <CardDescription className="font-bold">نسبة الخدمات النشطة مقابل المكتملة</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 text-sm mt-4 font-black">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-accent shadow-lg shadow-accent/20" />
              <span>طلبات نشطة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/20" />
              <span>مؤرشف / مكتمل</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}