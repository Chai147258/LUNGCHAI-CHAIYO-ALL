const SUPABASE_URL = "https://hkwqrllqzfzsbsxqgaoo.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3FybGxxemZ6c2JzeHFnYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzIzNjAsImV4cCI6MjA5Njk0ODM2MH0.kPT_UY0-2-0cbDlGwya24DnOLJXA-XJGMdM6SIm7Rew";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase Connected");