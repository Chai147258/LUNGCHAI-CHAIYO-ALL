const SUPABASE_URL = "https://hkwqrllqzfzsbsxqgaoo.supabase.co";

const SUPABASE_ANON_KEY = "ใส่ Anon Key ของคุณ";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);