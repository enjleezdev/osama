"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
  barcode: z.string().min(1, "Barcode is required"),
  deviceName: z.string().min(2, "Device name must be at least 2 characters"),
  customerName: z.string().min(2, "Customer name is required"),
  serviceType: z.enum(['Charging', 'Maintenance', 'Software'] as const),
  description: z.string().min(5, "Please provide a brief description of the issue"),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Service Request Form</h2>
          <p className="text-sm text-muted-foreground">Log a new device for service</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode ID</FormLabel>
                <FormControl>
                  <Input placeholder="Scan or enter barcode" {...field} readOnly={!!initialBarcode} />
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
                  <FormLabel>Device Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., iPhone 13 Pro" {...field} />
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
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
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
                <FormLabel>Service Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Charging">
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="w-4 h-4 text-orange-500" />
                        <span>Charging</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Maintenance">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span>Maintenance</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Software">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-purple-500" />
                        <span>Software</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the problem or service needed..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              <Save className="w-4 h-4 mr-2" />
              Save Record
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}