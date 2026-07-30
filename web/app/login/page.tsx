"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      window.location.href = "/";
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
          <h1 className="font-headline-lg text-xl text-white font-bold">เข้าสู่ระบบ</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-0 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-primary text-sm">เข้าสู่ระบบสำเร็จ กำลังพาไปหน้าแรก...</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-glossy w-full py-3 rounded-xl font-bold sun-flare-hover disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center text-on-surface-variant text-sm">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="text-primary-container hover:underline font-bold">
            สมัครสมาชิก
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
