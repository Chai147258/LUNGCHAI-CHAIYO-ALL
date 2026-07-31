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
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-black">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/Chai147258/LUNGCHAI-CHAIYO-ALL/main/images/logo-all.jpg"
            alt="Lungchai Chaiyo All"
            className="w-16 h-16 rounded-full object-cover border-2 border-lime-400/60"
          />
          <h1 className="text-xl text-white font-bold">เข้าสู่ระบบ</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-gray-400 text-sm">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-400 text-sm">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-lime-400 text-sm">เข้าสู่ระบบสำเร็จ กำลังพาไปหน้าแรก...</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-400 text-black font-bold rounded-xl py-3 hover:bg-lime-300 transition-colors disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="text-lime-400 hover:underline font-bold">
            สมัครสมาชิก
          </a>
        </p>
        <p className="text-center">
          <a href="/" className="text-gray-400 text-sm hover:underline">
            ← กลับหน้าแรก
          </a>
        </p>
      </div>
    </main>
  );
}
