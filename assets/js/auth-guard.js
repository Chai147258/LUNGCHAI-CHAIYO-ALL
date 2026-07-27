/* ═══════════════════════════════════════════════════════════
   LUNGCHAI CHAIYO — Shared Auth Guard
   ใช้ร่วมกันทุกโซนที่ต้อง login: user / technician / admin
   วิธีใช้: <script src="/assets/js/auth-guard.js" data-zone="admin"></script>
   ใส่เป็นบรรทัดแรกๆ ใน <head> ของทุกหน้าที่ต้อง login
   ═══════════════════════════════════════════════════════════ */
(function(){
  const SB_URL = 'https://hkwqrllqzfzsbsxqgaoo.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3FybGxxemZ6c2JzeHFnYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzIzNjAsImV4cCI6MjA5Njk0ODM2MH0.kPT_UY0-2-0cbDlGwya24DnOLJXA-XJGMdM6SIm7Rew';
  const TECH_STORAGE_KEY = 'lc_tech_session';

  const scriptTag = document.currentScript;
  const zone = scriptTag ? scriptTag.getAttribute('data-zone') : null;

  if (!zone) {
    console.warn('[auth-guard] ไม่พบ data-zone บน <script> tag — ข้ามการตรวจสอบสิทธิ์');
    return;
  }

  function redirectToLogin(path){
    // เก็บหน้าที่ตั้งใจจะเข้า ไว้เด้งกลับมาหลัง login สำเร็จ
    const back = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(path + '?redirect=' + back);
  }

  async function rpc(fn, body){
    const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body || {})
    });
    if (!res.ok) throw new Error('rpc_failed');
    return res.json();
  }

  async function checkUserZone(){
    // ต้องโหลด @supabase/supabase-js ไว้ก่อนหน้านี้ในหน้าเว็บแล้ว
    if (typeof supabase === 'undefined') {
      console.error('[auth-guard] supabase-js ยังไม่ถูกโหลด ต้องใส่ <script src="...supabase-js@2"> ก่อน auth-guard.js');
      return;
    }
    const client = supabase.createClient(SB_URL, SB_KEY);
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
      redirectToLogin('/user/login.html');
    }
  }

  async function checkTechnicianZone(){
    const raw = localStorage.getItem(TECH_STORAGE_KEY);
    if (!raw) {
      redirectToLogin('/technician/index.html');
      return;
    }
    let session;
    try { session = JSON.parse(raw); } catch(e) { session = null; }
    if (!session || !session.token) {
      redirectToLogin('/technician/index.html');
    }
    // หมายเหตุ: การตรวจสอบ token จริงเกิดขึ้นฝั่ง Supabase ทุกครั้งที่เรียก RPC
    // (technician_get_jobs ฯลฯ) auth-guard นี้เช็คแค่ "มี session อยู่ในเครื่องไหม" เพื่อกันเข้าหน้าเปล่าๆ
  }

  async function checkAdminZone(){
    if (typeof supabase === 'undefined') {
      console.error('[auth-guard] supabase-js ยังไม่ถูกโหลด ต้องใส่ <script src="...supabase-js@2"> ก่อน auth-guard.js');
      return;
    }
    const client = supabase.createClient(SB_URL, SB_KEY);
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
      redirectToLogin('/admin/index.html');
      return;
    }
    try {
      const res = await fetch(`${SB_URL}/rest/v1/rpc/is_admin`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: '{}'
      });
      const isAdmin = await res.json();
      if (isAdmin !== true) {
        alert('บัญชีนี้ไม่มีสิทธิ์เข้าหน้าแอดมิน');
        window.location.replace('/main/index.html');
      }
    } catch(e) {
      console.error('[auth-guard] ตรวจสอบสิทธิ์แอดมินไม่สำเร็จ', e);
      window.location.replace('/main/index.html');
    }
  }

  switch(zone){
    case 'user':
      checkUserZone();
      break;
    case 'technician':
      checkTechnicianZone();
      break;
    case 'admin':
      checkAdminZone();
      break;
    default:
      console.warn('[auth-guard] ไม่รู้จัก data-zone="' + zone + '"');
  }
})();
