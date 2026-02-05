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
import { Search, History, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ArchiveProps {
  records: DeviceRecord[];
}

export function Archive({ records }: ArchiveProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const archived = records
    .filter(r => r.status === 'Archived')
    .filter(r => 
      r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.archivedDate!).getTime() - new Date(a.archivedDate!).getTime());

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              Service Archive
            </CardTitle>
            <CardDescription>Historical data for all completed device handovers</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 bg-gray-50/50 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by barcode, device or customer..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[120px]">Barcode</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Archived On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archived.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                      No archived records found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  archived.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono text-sm font-medium">{record.barcode}</TableCell>
                      <TableCell className="font-medium">{record.deviceName}</TableCell>
                      <TableCell>{record.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {record.serviceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {record.archivedDate ? format(new Date(record.archivedDate), 'MMM d, yyyy') : 'N/A'}
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