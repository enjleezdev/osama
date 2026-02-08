
import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم من إعدادات مشروعك في Supabase (Settings -> API)
const supabaseUrl = 'https://your-project-id.supabase.co'; 
const supabaseKey = 'your-anon-public-key'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
