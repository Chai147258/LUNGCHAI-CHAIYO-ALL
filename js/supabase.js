const SUPABASE_URL = "https://hkwqrllqzfzsbsxqgaoo.supabase.co";

const SUPABASE_ANON_KEY = "ใส่ Anon Key ใหม่จาก Supabase";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase Connected");