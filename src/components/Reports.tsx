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
      Charging: records.filter(r => r.serviceType === 'Charging').length,
      Maintenance: records.filter(r => r.serviceType === 'Maintenance').length,
      Software: records.filter(r => r.serviceType === 'Software').length,
    };

    const statusData = [
      { name: 'Active', value: records.filter(r => r.status === 'Active').length },
      { name: 'Archived', value: records.filter(r => r.status === 'Archived').length },
    ];

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    
    return { categoryData, statusData, total: records.length, archivedCount: statusData[1].value };
  }, [records]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm opacity-80">Total Serviced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="flex items-center text-xs mt-2 gap-1">
              <TrendingUp className="w-3 h-3" />
              Lifetime volume
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Unique Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Set(records.map(r => r.customerName)).size}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2 gap-1">
              <Users className="w-3 h-3" />
              Total client base
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Handed Over</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.archivedCount}</div>
            <div className="flex items-center text-xs text-green-600 mt-2 gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Completed & Delivered
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2d</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2 gap-1">
              <Clock className="w-3 h-3" />
              Turnaround time
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>Volume distribution across service types</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ChartContainer config={{ 
              value: { label: 'Service Volume', color: 'hsl(var(--primary))' }
            }}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Completion Status</CardTitle>
            <CardDescription>Ratio of active vs completed services</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span>Active Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Archived / Completed</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}