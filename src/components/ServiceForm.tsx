"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceType } from '@/app/lib/types';
import { BatteryCharging, Settings, Code, Save } from 'lucide-react';

const formSchema = z.object({
  barcode: z.string().min(1, "الباركود مطلوب"),
  deviceName: z.string().min(2, "اسم الجهاز يجب أن يكون حرفين على الأقل"),
  customerName: z.string().min(2, "اسم العميل مطلوب"),
  serviceType: z.enum(['Charging', 'Maintenance', 'Software'] as const),
  description: z.string().optional(),
}).refine((data) => {
  if (data.serviceType !== 'Charging') {
    return data.description && data.description.length >= 5;
  }
  return true;
}, {
  message: "يرجى تقديم وصف مختصر للمشكلة",
  path: ["description"],
});

interface ServiceFormProps {
  initialBarcode?: string;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function ServiceForm({ initialBarcode, onSubmit, onCancel }: ServiceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: initialBarcode || '',
      deviceName: '',
      customerName: '',
      serviceType: 'Maintenance',
      description: '',
    },
  });

  const serviceType = form.watch('serviceType');

  return (
    <div className="p-6 md:p-10 space-y-6 text-right" dir="rtl">
      <div className="flex items-center gap-2 justify-end">
        <div className="text-right">
          <h2 className="text-xl font-black text-gray-800">نموذج طلب الخدمة</h2>
          <p className="text-sm text-muted-foreground font-bold">تسجيل جهاز جديد في النظام</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Settings className="w-6 h-6" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black">رقم الباركود</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="امسح أو أدخل الباركود" 
                    {...field} 
                    readOnly={!!initialBarcode} 
                    className="h-14 rounded-2xl bg-gray-50 border-none font-black text-right shadow-inner" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="deviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">موديل الجهاز</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: iPhone 13 Pro" {...field} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-right shadow-inner" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">اسم العميل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم بالكامل" {...field} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-right shadow-inner" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black">فئة الخدمة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black flex-row-reverse shadow-inner">
                      <SelectValue placeholder="اختر فئة الخدمة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent align="end" className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="Charging" className="flex-row-reverse text-right font-bold">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <BatteryCharging className="w-4 h-4 text-orange-500" />
                        <span>شحن الهاتف</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Maintenance" className="flex-row-reverse text-right font-bold">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span>صيانة هاردوير</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Software" className="flex-row-reverse text-right font-bold">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Code className="w-4 h-4 text-primary" />
                        <span>برمجة / سوفتوير</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {serviceType !== 'Charging' && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">وصف المشكلة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="صف المشكلة أو الخدمة المطلوبة بالتفصيل..." 
                      className="min-h-[120px] rounded-2xl bg-gray-50 border-none font-bold text-right shadow-inner"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t border-dashed">
            <Button type="submit" className="flex-1 h-14 bg-accent hover:bg-accent/90 text-white font-black rounded-2xl shadow-xl shadow-accent/20">
              <Save className="w-5 h-5 ml-2" />
              حفظ السجل في النظام
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} className="h-14 font-black rounded-2xl text-gray-400">
              إلغاء العملية
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
