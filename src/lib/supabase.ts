
import { createClient } from '@supabase/supabase-js';

// ملاحظة: استبدل هذه القيم بالقيم الحقيقية من إعدادات Supabase (Settings > API)
const supabaseUrl = 'https://dliyecdgtcwhdbtjdfck.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsaXllY2RndGN3aGRidGpkZmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MjM4MzUsImV4cCI6MjA4NjA5OTgzNX0.vVdOb_JI_gz80pQoePoJFR35c-zuX0raawe75EIXImE'; 

// فحص للتأكد من أن الرابط صالح قبل محاولة إنشاء العميل لتجنب الانهيار
const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http');
  } catch {
    return false;
  }
};

export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseKey)
  : { 
      from: () => ({ 
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
      }),
      supabaseUrl: 'invalid'
    } as any;
