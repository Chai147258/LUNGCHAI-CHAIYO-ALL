"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Technician = {
  id: number;
  full_name: string;
  business_name: string | null;
  area: string | null;
  phone: string | null;
  login_phone: string | null;
  skill: string | null;
  active: boolean;
  is_online: boolean;
  pin_code?: string | null;
};

export default function AdminTechniciansPage() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data: techData, error: techErr } = await supabase
      .from("technicians")
      .select("id, full_name, business_name, area, phone, login_phone, skill, active, is_online")
      .order("id", { ascending: true });

    const { data: credData } = await supabase
      .from("technician_credentials")
      .select("technician_id, pin_code");

    if (techErr) {
      console.error(techErr);
      setTechs([]);
    } else {
      const credMap = new Map((credData || []).map((c) => [c.technician_id, c.pin_code]));
      setTechs((techData || []).map((t) => ({ ...t, pin_code: credMap.get(t.id) || "" })));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(id: number, field: keyof Technician, value: string | boolean) {
    setTechs((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  async function saveRow(t: Technician) {
    setSavingId(t.id);
    setMessage(null);

    const { error: techError } = await supabase
      .from("technicians")
      .update({
        full_name: t.full_name,
        business_name: t.business_name,
        area: t.area,
        phone: t.phone,
        login_phone: t.login_phone,
        skill: t.skill,
        active: t.active,
      })
      .eq("id", t.id);

    let pinError = null;
    if (t.pin_code) {
      const res = await supabase
        .from("technician_credentials")
        .upsert({ technician_id: t.id, pin_code: t.pin_code }, { onConflict: "technician_id" });
      pinError = res.error;
    }

    setSavingId(null);
    if (techError || pinError) {
      setMessage(`บันทึกไม่สำเร็จ (${t.full_name}): ${techError?.message || pinError?.message}`);
    } else {
      setMessage(`บันทึก ${t.full_name} เรียบร้อย`);
    }
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">จัดการช่าง / ร้านค้า</h1>
            <p className="text-white/40 text-xs mt-1">
              เบอร์กลาง = โชว์ให้ลูกค้าเห็น | เบอร์ล็อกอิน + PIN = ใช้ภายใน ห้ามให้ลูกค้าเห็น
            </p>
          </div>
          <a href="/admin/dashboard" className="text-xs text-white/50 hover:text-lime-400">
            ← กลับแดชบอร์ด
          </a>
        </div>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-lime-300">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-white/40">กำลังโหลด...</p>
        ) : (
          <div className="space-y-4">
            {techs.map((t) => (
              <div
                key={t.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
              >
                <Field
                  label="ชื่อ"
                  value={t.full_name}
                  onChange={(v) => updateField(t.id, "full_name", v)}
                />
                <Field
                  label="ชื่อร้าน"
                  value={t.business_name || ""}
                  onChange={(v) => updateField(t.id, "business_name", v)}
                />
                <Field
                  label="พื้นที่"
                  value={t.area || ""}
                  onChange={(v) => updateField(t.id, "area", v)}
                />
                <Field
                  label="ทักษะ"
                  value={t.skill || ""}
                  onChange={(v) => updateField(t.id, "skill", v)}
                />
                <Field
                  label="เบอร์กลาง (โชว์ลูกค้า)"
                  value={t.phone || ""}
                  onChange={(v) => updateField(t.id, "phone", v)}
                />
                <Field
                  label="เบอร์ล็อกอิน (ห้ามโชว์)"
                  value={t.login_phone || ""}
                  onChange={(v) => updateField(t.id, "login_phone", v)}
                  danger
                />
                <Field
                  label="PIN (ห้ามโชว์)"
                  value={t.pin_code || ""}
                  onChange={(v) => updateField(t.id, "pin_code", v)}
                  danger
                />

                <div className="flex flex-col gap-2 justify-center">
                  <label className="flex items-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={t.active}
                      onChange={(e) => updateField(t.id, "active", e.target.checked)}
                      className="accent-lime-400"
                    />
                    ใช้งานในระบบ (active)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white/60">
                    <input type="checkbox" checked={t.is_online} disabled className="accent-lime-400" />
                    ออนไลน์ (ช่างคุมเอง แก้ที่นี่ไม่ได้)
                  </label>
                  <button
                    onClick={() => saveRow(t)}
                    disabled={savingId === t.id}
                    className="mt-1 bg-lime-400 text-black text-xs font-bold py-2 rounded-lg hover:brightness-95 disabled:opacity-50"
                  >
                    {savingId === t.id ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  danger,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  danger?: boolean;
}) {
  return (
    <div>
      <label className={`text-[11px] block mb-1 ${danger ? "text-orange-400" : "text-white/40"}`}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-black/50 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none ${
          danger ? "border-orange-400/30 focus:border-orange-400" : "border-white/10 focus:border-lime-400"
        }`}
      />
    </div>
  );
}
