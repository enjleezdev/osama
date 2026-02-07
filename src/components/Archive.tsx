"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeviceRecord } from '@/app/lib/types';
import { format } from 'date-fns';
import { Search, History, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ArchiveProps {
  records: DeviceRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function Archive({ records, onDelete, onClearAll }: ArchiveProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();
  
  const archived = records
    .filter(r => r.status === 'Archived')
    .filter(r => 
      r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.archivedDate!).getTime() - new Date(a.archivedDate!).getTime());

  const handleExportClick = () => {
    toast({
      title: "تنبيه",
      description: "ما تهبش القسم ده قيد التطوير",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <Card className="border-none shadow-sm overflow-hidden rounded-[2.5rem]">
        <CardHeader className="bg-white border-b border-gray-100 flex flex-col md:flex-row-reverse items-center justify-between gap-4 p-6">
          <div className="text-right">
            <CardTitle className="flex items-center justify-end gap-2 text-xl font-black">
              أرشيف الخدمات
              <History className="w-5 h-5 text-primary" />
            </CardTitle>
            <CardDescription className="font-bold">سجل العمليات المكتملة والأجهزة التي تم تسليمها</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="rounded-xl font-black gap-2 h-10 px-4" disabled={archived.length === 0}>
                  <Trash2 className="w-4 h-4" />
                  حذف الكل
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                <AlertDialogHeader className="text-right">
                  <AlertDialogTitle className="font-black text-xl flex items-center justify-end gap-2">
                    تأكيد حذف الأرشيف
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-right font-bold text-gray-600">
                    هل أنت متأكد من رغبتك في حذف جميع السجلات المؤرشفة؟ سيتم حذفها نهائياً ولا يمكن استرجاعها.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-3">
                  <AlertDialogAction onClick={onClearAll} className="bg-destructive hover:bg-destructive/90 text-white font-black rounded-xl h-12 flex-1">
                    نعم، احذف الكل
                  </AlertDialogAction>
                  <AlertDialogCancel className="font-black rounded-xl h-12 flex-1 border-none bg-gray-100">
                    إلغاء
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={handleExportClick} className="rounded-xl font-black gap-2 h-10 px-4">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 bg-gray-50/50 border-b">
            <div className="relative max-w-md mr-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="ابحث بالباركود، اسم الجهاز أو العميل..." 
                className="pr-12 h-12 rounded-2xl border-none bg-white font-black text-right shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-right font-black">الباركود</TableHead>
                  <TableHead className="text-right font-black">الجهاز</TableHead>
                  <TableHead className="text-right font-black">العميل</TableHead>
                  <TableHead className="text-right font-black">تاريخ الأرشفة</TableHead>
                  <TableHead className="text-right font-black">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archived.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center text-muted-foreground font-bold">
                      <div className="flex flex-col items-center gap-2">
                        <History className="w-12 h-12 opacity-10" />
                        لا توجد سجلات مؤرشفة تطابق بحثك.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  archived.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50/30 transition-colors">
                      <TableCell className="font-mono text-sm font-bold text-primary">{record.barcode}</TableCell>
                      <TableCell className="font-black">{record.deviceName}</TableCell>
                      <TableCell className="font-bold text-gray-600">{record.customerName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-bold">
                        {record.archivedDate ? format(new Date(record.archivedDate), 'yyyy/MM/dd') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                            <AlertDialogHeader className="text-right">
                              <AlertDialogTitle className="font-black text-xl flex items-center justify-end gap-2">
                                حذف السجل
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right font-bold text-gray-600">
                                هل أنت متأكد من رغبتك في حذف سجل جهاز ({record.deviceName})؟ سيتم حذفه نهائياً.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row-reverse gap-3">
                              <AlertDialogAction onClick={() => onDelete(record.id)} className="bg-destructive hover:bg-destructive/90 text-white font-black rounded-xl h-12 flex-1">
                                نعم، احذف
                              </AlertDialogAction>
                              <AlertDialogCancel className="font-black rounded-xl h-12 flex-1 border-none bg-gray-100">
                                إلغاء
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
