"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Registration = {
  id: string;
  registration_no: string;
  full_name: string;
  business_name: string | null;
  phone: string;
  line_id: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  subdistrict: string | null;
  skills: string[] | null;
  id_card_path: string | null;
  portrait_path: string | null;
  bank_name: string | null;
  bank_account_no: string | null;
  bank_account_name: string | null;
  tax_id: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

export default function AdminApplicationsPage() {
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_partner_registrations", {
      p_status: status,
    });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(data || []);
      loadImages(data || []);
    }
    setLoading(false);
  }

  async function loadImages(list: Registration[]) {
    const urls: Record<string, string> = {};
    for (const r of list) {
      for (const path of [r.id_card_path, r.portrait_path]) {
        if (path && !urls[path]) {
          const { data } = await supabase.storage.from("documents").createSignedUrl(path, 600);
          if (data?.signedUrl) urls[path] = data.signedUrl;
        }
      }
    }
    setImageUrls((prev) => ({ ...prev, ...urls }));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function approve(r: Registration) {
    setBusyId(r.id);
    setResult(null);
    const { data, error } = await supabase.rpc("approve_partner_registration", {
      p_registration_id: r.id,
    });
    setBusyId(null);
    if (error || !data?.success) {
      setResult(`อนุมัติไม่สำเร็จ (${r.full_name}): ${data?.message || error?.message}`);
    } else {
      setResult(
        `อนุมัติ ${r.full_name} สำเร็จ — เบอร์ล็อกอิน: ${data.login_phone} | PIN: ${data.login_pin} (บันทึกไว้ก่อนปิดหน้านี้ ดูซ้ำไม่ได้อีก)`
      );
    }
    load();
  }

  async function reject(r: Registration) {
    const reason = prompt(`เหตุผลที่ปฏิเสธใบสมัครของ ${r.full_name}`);
    if (reason === null) return;
    setBusyId(r.id);
    const { error } = await supabase.rpc("reject_partner_registration", {
      p_registration_id: r.id,
      p_reason: reason,
    });
    setBusyId(null);
    setResult(error ? `ปฏิเสธไม่สำเร็จ: ${error.message}` : `ปฏิเสธใบสมัครของ ${r.full_name} แล้ว`);
    load();
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">ใบสมัครช่าง/ร้านค้าพันธมิตร</h1>
          <a href="/admin/dashboard" className="text-xs text-white/50 hover:text-lime-400">
            ← กลับแดชบอร์ด
          </a>
        </div>

        <div className="flex gap-2 mb-5">
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                status === s ? "bg-lime-400 text-black border-lime-400" : "border-white/15 text-white/60"
              }`}
            >
              {s === "pending" ? "รอตรวจสอบ" : s === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว"}
            </button>
          ))}
        </div>

        {result && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-lime-300">
            {result}
          </div>
        )}

        {loading ? (
          <p className="text-white/40">กำลังโหลด...</p>
        ) : rows.length === 0 ? (
          <p className="text-white/40">ไม่มีใบสมัครในสถานะนี้</p>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold">{r.full_name}</span>
                    {r.business_name && <span className="text-white/50 text-sm ml-2">({r.business_name})</span>}
                  </div>
                  <span className="text-[10px] text-white/40">{r.registration_no}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/70 mb-4">
                  <p>เบอร์: {r.phone}</p>
                  <p>LINE: {r.line_id || "-"}</p>
                  <p>ที่อยู่: {r.address} {r.subdistrict} {r.district} {r.province}</p>
                  <p>ทักษะ: {(r.skills || []).join(", ") || "-"}</p>
                  <p>ธนาคาร: {r.bank_name || "-"} {r.bank_account_no} ({r.bank_account_name})</p>
                  <p>เลขผู้เสียภาษี/บัตร ปชช.: {r.tax_id || "-"}</p>
                  {r.note && <p className="sm:col-span-2">หมายเหตุ: {r.note}</p>}
                </div>

                <div className="flex gap-3 mb-4">
                  {r.id_card_path && imageUrls[r.id_card_path] && (
                    <a href={imageUrls[r.id_card_path]} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrls[r.id_card_path]}
                        alt="บัตรประชาชน"
                        className="w-28 h-20 object-cover rounded-lg border border-white/10"
                      />
                    </a>
                  )}
                  {r.portrait_path && imageUrls[r.portrait_path] && (
                    <a href={imageUrls[r.portrait_path]} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrls[r.portrait_path]}
                        alt="รูปคู่บัตร"
                        className="w-28 h-20 object-cover rounded-lg border border-white/10"
                      />
                    </a>
                  )}
                </div>

                {status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(r)}
                      disabled={busyId === r.id}
                      className="flex-1 bg-lime-400 text-black font-bold py-2.5 rounded-xl disabled:opacity-50"
                    >
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => reject(r)}
                      disabled={busyId === r.id}
                      className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl disabled:opacity-50"
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
