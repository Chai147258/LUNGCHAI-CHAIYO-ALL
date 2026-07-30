"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/images/logo-all.jpg"
            alt="Lungchai Chaiyo All"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/40"
          />
          <h1 className="font-headline-lg text-xl text-white font-bold">สมัครสมาชิก</h1>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-primary text-sm">
              สมัครสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ
            </p>
            <a href="/login" className="btn-glossy inline-block px-8 py-3 rounded-xl font-bold sun-flare-hover">
              ไปหน้าเข้าสู่ระบบ
            </a>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-on-surface-variant text-sm">ชื่อ-นามสกุล</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-all"
                placeholder="ชื่อของคุณ"
              />
            </div>
            <div className="space-y-1">
              <label className="text-on-surface-variant text-sm">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-on-surface-variant text-sm">รหัสผ่าน</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-all"
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-glossy w-full py-3 rounded-xl font-bold sun-flare-hover disabled:opacity-50"
            >
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>
          </form>
        )}

        <p className="text-center text-on-surface-variant text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <a href="/login" className="text-primary-container hover:underline font-bold">
            เข้าสู่ระบบ
          </a>
        </p>
        <p className="text-center">
          <a href="/" className="text-on-surface-variant text-sm hover:underline">
            ← กลับหน้าแรก
          </a>
        </p>
      </div>
    </main>
  );
}
