
import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم من إعدادات مشروعك في Supabase
// Settings -> API
const supabaseUrl = 'https://your-project-id.supabase.co'; // ضع الرابط هنا
const supabaseKey = 'your-anon-public-key'; // ضع المفتاح هنا

export const supabase = createClient(supabaseUrl, supabaseKey);
