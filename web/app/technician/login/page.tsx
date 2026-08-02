"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const SESSION_KEY = "lc_tech_session";

export default function TechnicianLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    if (!phone || !pin) {
      setError("กรอกเบอร์และรหัส PIN ให้ครบ");
      return;
    }
    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc("technician_login", {
      p_phone: phone,
      p_pin: pin,
    });
    setLoading(false);

    if (rpcError) {
      setError("ระบบขัดข้อง ลองใหม่อีกครั้ง");
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || !row.session_token) {
      setError("เบอร์หรือ PIN ไม่ถูกต้อง");
      return;
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        token: row.session_token,
        technician_id: row.technician_id,
        full_name: row.full_name,
      })
    );
    router.push("/technician/portal");
  }

  return (
    <main className="min-h-screen bg-[#0a1128] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-white">engineering</span>
          </div>
          <h1 className="text-white font-bold text-2xl">เข้าสู่ระบบช่าง</h1>
          <p className="text-blue-200/60 text-sm mt-1">LUNGCHAI CHAIYO ALL</p>
        </div>

        <div className="bg-[#111a3b] border border-blue-400/20 rounded-2xl p-6">
          <label className="block text-blue-200/80 text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0xxxxxxxxx"
            className="w-full bg-[#0a1128] border border-blue-400/30 rounded-xl px-4 py-4 text-lg text-white text-center tracking-wider focus:outline-none focus:border-orange-400 mb-4"
          />

          <label className="block text-blue-200/80 text-sm font-bold mb-2">รหัส PIN</label>
          <input
            type="tel"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            maxLength={6}
            className="w-full bg-[#0a1128] border border-blue-400/30 rounded-xl px-4 py-4 text-2xl text-white text-center tracking-[0.5em] focus:outline-none focus:border-orange-400 mb-4"
          />

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-colors"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <p className="text-center text-blue-200/40 text-xs mt-6">
          ลืมรหัส หรือมีปัญหาการเข้าสู่ระบบ ติดต่อทีมงานส่วนกลาง
        </p>
      </div>
    </main>
  );
}
