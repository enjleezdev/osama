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
  // إذا لم تكن الخدمة "شحن"، فإن الوصف يصبح إجبارياً (على الأقل 5 أحرف)
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
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex items-center gap-2 justify-end">
        <div>
          <h2 className="text-xl font-semibold">نموذج طلب الخدمة</h2>
          <p className="text-sm text-muted-foreground">تسجيل جهاز جديد في النظام</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الباركود</FormLabel>
                <FormControl>
                  <Input placeholder="امسح أو أدخل الباركود" {...field} readOnly={!!initialBarcode} className="text-right" />
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
                  <FormLabel>موديل الجهاز</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: iPhone 13 Pro" {...field} className="text-right" />
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
                  <FormLabel>اسم العميل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم بالكامل" {...field} className="text-right" />
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
                <FormLabel>فئة الخدمة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-row-reverse">
                      <SelectValue placeholder="اختر فئة الخدمة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent align="end">
                    <SelectItem value="Charging">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <BatteryCharging className="w-4 h-4 text-orange-500" />
                        <span>شحن الهاتف</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Maintenance">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span>صيانة هاردوير</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Software">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <Code className="w-4 h-4 text-purple-500" />
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
                  <FormLabel>وصف المشكلة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="صف المشكلة أو الخدمة المطلوبة بالتفصيل..." 
                      className="min-h-[100px] text-right"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-start gap-3 pt-4 border-t">
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              <Save className="w-4 h-4 ml-2" />
              حفظ السجل
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
