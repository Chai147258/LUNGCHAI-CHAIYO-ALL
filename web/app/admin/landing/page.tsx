"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type LandingSettings = {
  logo_url: string;
  youtube_url: string;
  chatbot_heading: string;
  chatbot_subtext: string;
  register_link: string;
  login_link: string;
};

export default function AdminLandingPage() {
  const [settings, setSettings] = useState<LandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("landing_page_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as LandingSettings);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("landing_page_settings")
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    setMessage(error ? "บันทึกไม่สำเร็จ: " + error.message : "บันทึกสำเร็จแล้ว ✓ กลับไปหน้าแรกแล้วรีเฟรชดูได้เลย");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
        กำลังโหลด...
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
        ไม่พบข้อมูลการตั้งค่า
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 flex justify-center bg-black">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl space-y-6">
        <h1 className="text-xl text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-lime-400">edit_note</span>
          จัดการเนื้อหาหน้าแรก (Landing Page CMS)
        </h1>

        <form onSubmit={handleSave} className="space-y-4">
          <Field
            label="โลโก้ (URL รูปภาพ)"
            value={settings.logo_url}
            onChange={(v) => setSettings({ ...settings, logo_url: v })}
          />
          <Field
            label="ลิงก์วิดีโอ YouTube (วางลิงก์เต็มจากช่องได้เลย เช่น https://youtube.com/watch?v=xxxx)"
            value={settings.youtube_url}
            onChange={(v) => setSettings({ ...settings, youtube_url: v })}
          />
          <Field
            label="หัวข้อกล่องแชทบอท"
            value={settings.chatbot_heading}
            onChange={(v) => setSettings({ ...settings, chatbot_heading: v })}
          />
          <Field
            label="ข้อความอธิบายแชทบอท"
            value={settings.chatbot_subtext}
            onChange={(v) => setSettings({ ...settings, chatbot_subtext: v })}
            textarea
          />
          <Field
            label="ลิงก์ปุ่มสมัครสมาชิก"
            value={settings.register_link}
            onChange={(v) => setSettings({ ...settings, register_link: v })}
          />
          <Field
            label="ลิงก์ปุ่มเข้าสู่ระบบ"
            value={settings.login_link}
            onChange={(v) => setSettings({ ...settings, login_link: v })}
          />

          {message && <p className="text-lime-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lime-400 text-black font-bold rounded-xl py-3 hover:bg-lime-300 transition-colors disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </form>

        <p className="text-center">
          <a href="/" className="text-gray-400 text-sm hover:underline">
            ← กลับหน้าแรก (เปิดดูผลลัพธ์)
          </a>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-gray-400 text-sm">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
        />
      )}
    </div>
  );
}
