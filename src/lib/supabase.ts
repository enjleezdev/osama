
import { createClient } from '@supabase/supabase-js';

// ملاحظة: استبدل هذه القيم بالقيم الحقيقية من إعدادات Supabase (Settings > API)
// الرابط يجب أن يبدأ بـ https://
const supabaseUrl = 'https://your-project-id.supabase.co'; 
const supabaseKey = 'your-anon-key-here'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
