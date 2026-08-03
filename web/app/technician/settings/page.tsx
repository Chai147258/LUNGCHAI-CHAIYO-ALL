"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const SESSION_KEY = "lc_tech_session";
const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const MANDATORY_SERVICE_IDS = [1]; // ค่าตรวจเช็คหน้างาน — บังคับเลือกเสมอ

type Session = { token: string; technician_id: number; full_name: string };
type ServiceRow = {
  service_id: number;
  service_name: string;
  category_id: number | null;
  normal_price: number;
  is_offered: boolean;
};
type PortfolioPhoto = { id: string; photo_url: string; caption: string | null };
type DayHour = { day_of_week: number; is_24h: boolean; start_time: string; end_time: string; enabled: boolean };

export default function TechnicianSettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [hours, setHours] = useState<DayHour[]>(
    DAYS.map((_, i) => ({ day_of_week: i, is_24h: false, start_time: "08:00", end_time: "18:00", enabled: false }))
  );
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const loadAll = useCallback(async (token: string) => {
    setLoading(true);
    const [svcRes, hoursRes, portfolioRes] = await Promise.all([
      supabase.rpc("technician_get_services", { p_token: token }),
      supabase.rpc("technician_session_owner", { p_token: token }),
      supabase.rpc("technician_get_my_portfolio", { p_token: token }),
    ]);

    setServices(
      (svcRes.data || []).map((s: ServiceRow) => ({
        service_id: s.service_id,
        service_name: s.service_name,
        category_id: s.category_id,
        normal_price: s.normal_price,
        is_offered: s.is_offered,
      }))
    );
    setPhotos(portfolioRes.data || []);

    const techId = hoursRes.data;
    if (techId) {
      const { data: hourRows } = await supabase
        .from("technician_weekly_hours")
        .select("day_of_week, is_24h, start_time, end_time")
        .eq("technician_id", techId);
      if (hourRows && hourRows.length) {
        setHours(
          DAYS.map((_, i) => {
            const row = hourRows.find((h) => h.day_of_week === i);
            return row
              ? {
                  day_of_week: i,
                  is_24h: row.is_24h,
                  start_time: row.start_time?.slice(0, 5) || "08:00",
                  end_time: row.end_time?.slice(0, 5) || "18:00",
                  enabled: true,
                }
              : { day_of_week: i, is_24h: false, start_time: "08:00", end_time: "18:00", enabled: false };
          })
        );
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      router.replace("/technician/login");
      return;
    }
    const parsed: Session = JSON.parse(raw);
    setSession(parsed);
    loadAll(parsed.token);
  }, [router, loadAll]);

  function toggleService(id: number) {
    if (MANDATORY_SERVICE_IDS.includes(id)) return;
    setServices((prev) => prev.map((s) => (s.service_id === id ? { ...s, is_offered: !s.is_offered } : s)));
  }

  async function saveServices() {
    if (!session) return;
    setSaving(true);
    const ids = services.filter((s) => s.is_offered || MANDATORY_SERVICE_IDS.includes(s.service_id)).map((s) => s.service_id);
    const { error } = await supabase.rpc("technician_set_services", {
      p_token: session.token,
      p_service_ids: ids,
    });
    setSaving(false);
    setMessage(error ? `บันทึกบริการไม่สำเร็จ: ${error.message}` : "บันทึกบริการที่ให้เรียบร้อย");
  }

  function updateHour(day: number, field: keyof DayHour, value: string | boolean) {
    setHours((prev) => prev.map((h) => (h.day_of_week === day ? { ...h, [field]: value } : h)));
  }

  async function saveHours() {
    if (!session) return;
    setSaving(true);
    const payload = hours
      .filter((h) => h.enabled)
      .map((h) => ({
        day_of_week: h.day_of_week,
        is_24h: h.is_24h,
        start_time: h.is_24h ? null : h.start_time,
        end_time: h.is_24h ? null : h.end_time,
      }));
    const { error } = await supabase.rpc("technician_set_weekly_hours", {
      p_token: session.token,
      p_hours: payload,
    });
    setSaving(false);
    setMessage(error ? `บันทึกเวลาทำงานไม่สำเร็จ: ${error.message}` : "บันทึกเวลาทำงานเรียบร้อย");
  }

  async function addPhoto() {
    if (!session || !uploadFile) return;
    setSaving(true);
    const ext = uploadFile.name.split(".").pop();
    const path = `portfolio/${session.technician_id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("technicians").upload(path, uploadFile);
    if (uploadError) {
      setSaving(false);
      setMessage(`อัปโหลดรูปไม่สำเร็จ: ${uploadError.message}`);
      return;
    }
    const { data: urlData } = supabase.storage.from("technicians").getPublicUrl(path);
    const { error } = await supabase.rpc("technician_add_portfolio_photo", {
      p_token: session.token,
      p_photo_url: urlData.publicUrl,
      p_caption: null,
    });
    setSaving(false);
    setUploadFile(null);
    if (error) {
      setMessage(`เพิ่มผลงานไม่สำเร็จ: ${error.message}`);
    } else {
      setMessage("เพิ่มผลงานเรียบร้อย");
      loadAll(session.token);
    }
  }

  async function deletePhoto(id: string) {
    if (!session) return;
    await supabase.rpc("technician_delete_portfolio_photo", { p_token: session.token, p_photo_id: id });
    loadAll(session.token);
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#0a1128] pb-16">
      <div className="bg-[#111a3b] border-b border-blue-400/20 px-5 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold">ตั้งค่าของฉัน</h1>
          <a href="/technician/portal" className="text-blue-200/50 text-xs hover:text-white">
            ← กลับพอร์ทัล
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-5 space-y-8">
        {message && (
          <div className="bg-blue-400/10 border border-blue-400/20 text-blue-200 text-sm rounded-xl px-4 py-2.5">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-blue-200/40 text-center py-10">กำลังโหลด...</p>
        ) : (
          <>
            {/* Services */}
            <section>
              <h2 className="text-white font-bold text-lg mb-1">บริการที่รับ + ค่าบริการ</h2>
              <p className="text-blue-200/40 text-xs mb-3">
                ราคาที่แสดงเป็นราคากลางของแพลตฟอร์ม — &quot;ค่าตรวจเช็คหน้างาน&quot; บังคับรับเสมอ
              </p>
              <div className="space-y-2 mb-3">
                {services.map((s) => {
                  const mandatory = MANDATORY_SERVICE_IDS.includes(s.service_id);
                  return (
                    <label
                      key={s.service_id}
                      className={`flex items-center justify-between gap-3 bg-[#111a3b] border rounded-xl px-4 py-3 ${
                        mandatory ? "border-orange-400/40" : "border-blue-400/20 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={s.is_offered || mandatory}
                          disabled={mandatory}
                          onChange={() => toggleService(s.service_id)}
                          className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-white text-sm">
                          {s.service_name} {mandatory && <span className="text-orange-400 text-[10px]">(บังคับ)</span>}
                        </span>
                      </div>
                      <span className="text-blue-200/50 text-sm">{s.normal_price} บาท</span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={saveServices}
                disabled={saving}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                บันทึกบริการ
              </button>
            </section>

            {/* Weekly hours */}
            <section>
              <h2 className="text-white font-bold text-lg mb-3">เวลาทำงานประจำสัปดาห์</h2>
              <div className="space-y-2 mb-3">
                {hours.map((h) => (
                  <div
                    key={h.day_of_week}
                    className="flex items-center gap-2 bg-[#111a3b] border border-blue-400/20 rounded-xl px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => updateHour(h.day_of_week, "enabled", e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-white text-sm w-16">{DAYS[h.day_of_week]}</span>
                    {h.enabled && (
                      <>
                        <label className="flex items-center gap-1 text-blue-200/60 text-xs">
                          <input
                            type="checkbox"
                            checked={h.is_24h}
                            onChange={(e) => updateHour(h.day_of_week, "is_24h", e.target.checked)}
                            className="accent-orange-500"
                          />
                          24 ชม.
                        </label>
                        {!h.is_24h && (
                          <>
                            <input
                              type="time"
                              value={h.start_time}
                              onChange={(e) => updateHour(h.day_of_week, "start_time", e.target.value)}
                              className="bg-[#0a1128] border border-blue-400/20 rounded-lg px-2 py-1 text-white text-xs"
                            />
                            <span className="text-blue-200/40 text-xs">-</span>
                            <input
                              type="time"
                              value={h.end_time}
                              onChange={(e) => updateHour(h.day_of_week, "end_time", e.target.value)}
                              className="bg-[#0a1128] border border-blue-400/20 rounded-lg px-2 py-1 text-white text-xs"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={saveHours}
                disabled={saving}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                บันทึกเวลาทำงาน
              </button>
            </section>

            {/* Portfolio */}
            <section>
              <h2 className="text-white font-bold text-lg mb-3">ผลงานของฉัน</h2>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {photos.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo_url} alt={p.caption || ""} className="w-full h-full object-cover" />
                    <button
                      onClick={() => deletePhoto(p.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs w-6 h-6 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-blue-200/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-bold mb-2"
              />
              <button
                onClick={addPhoto}
                disabled={saving || !uploadFile}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                เพิ่มรูปผลงาน
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
