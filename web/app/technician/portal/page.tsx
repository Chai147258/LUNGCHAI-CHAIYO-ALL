"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const SESSION_KEY = "lc_tech_session";

type Session = { token: string; technician_id: number; full_name: string };

type JobRow = {
  bucket: "available" | "mine";
  id: number;
  request_number: string;
  customer_name: string;
  phone: string;
  service_name: string | null;
  device_type: string | null;
  is_express: boolean;
  note: string | null;
  address: string | null;
  status: string;
  created_at: string;
};

type OfferRow = {
  offer_id: string;
  service_request_id: number;
  request_number: string;
  customer_name: string;
  phone: string;
  device_type: string | null;
  note: string | null;
  is_express: boolean;
  distance_km: number | null;
  fee_total: number | null;
  offered_at: string;
  expires_at: string;
};

export default function TechnicianPortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadAll = useCallback(async (token: string) => {
    setLoading(true);
    const [jobsRes, offersRes, techRes] = await Promise.all([
      supabase.rpc("technician_get_jobs", { p_token: token }),
      supabase.rpc("technician_get_offers", { p_token: token }),
      supabase.rpc("technician_session_owner", { p_token: token }),
    ]);

    if (jobsRes.error || offersRes.error || techRes.error === undefined) {
      // session invalid
    }
    setJobs(jobsRes.data || []);
    setOffers(offersRes.data || []);

    const techId = techRes.data;
    if (techId) {
      const { data: techRow } = await supabase
        .from("technicians")
        .select("is_online")
        .eq("id", techId)
        .maybeSingle();
      setIsOnline(!!techRow?.is_online);
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

  async function toggleOnline() {
    if (!session) return;
    const next = !isOnline;
    setIsOnline(next);
    await supabase.rpc("technician_set_online_status", {
      p_token: session.token,
      p_is_online: next,
    });
  }

  async function acceptOffer(offerId: string) {
    if (!session) return;
    setBusyId(offerId);
    const { data } = await supabase.rpc("respond_to_job_offer", {
      p_token: session.token,
      p_offer_id: offerId,
      p_accept: true,
    });
    setBusyId(null);
    setMessage(data?.ok ? "รับงานสำเร็จ" : `รับงานไม่สำเร็จ: ${data?.error || ""}`);
    loadAll(session.token);
  }

  async function rejectOffer(offerId: string) {
    if (!session) return;
    setBusyId(offerId);
    await supabase.rpc("respond_to_job_offer", {
      p_token: session.token,
      p_offer_id: offerId,
      p_accept: false,
    });
    setBusyId(null);
    loadAll(session.token);
  }

  async function acceptAvailableJob(requestId: number) {
    if (!session) return;
    setBusyId(String(requestId));
    const { data: ok } = await supabase.rpc("technician_accept_job", {
      p_token: session.token,
      p_request_id: requestId,
    });
    setBusyId(null);
    setMessage(ok ? "รับงานสำเร็จ" : "งานนี้ถูกรับไปแล้ว");
    loadAll(session.token);
  }

  async function updateJobStatus(requestId: number, status: "in_progress" | "completed" | "cancelled") {
    if (!session) return;
    setBusyId(String(requestId) + status);
    await supabase.rpc("technician_update_status", {
      p_token: session.token,
      p_request_id: requestId,
      p_status: status,
      p_note: null,
    });
    setBusyId(null);
    loadAll(session.token);
  }

  async function logout() {
    if (session) {
      await supabase.rpc("technician_logout", { p_token: session.token });
    }
    localStorage.removeItem(SESSION_KEY);
    router.replace("/technician/login");
  }

  if (!session) return null;

  const mineJobs = jobs.filter((j) => j.bucket === "mine");
  const availableJobs = jobs.filter((j) => j.bucket === "available");

  return (
    <main className="min-h-screen bg-[#0a1128] pb-16">
      {/* Header */}
      <div className="bg-[#111a3b] border-b border-blue-400/20 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <p className="text-white font-bold">{session.full_name}</p>
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-1.5 text-xs font-bold mt-1 px-2.5 py-1 rounded-full ${
                isOnline ? "bg-lime-400/20 text-lime-400" : "bg-white/10 text-white/40"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-lime-400" : "bg-white/40"}`}></span>
              {isOnline ? "ออนไลน์ (แตะเพื่อปิด)" : "ออฟไลน์ (แตะเพื่อเปิด)"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <a href="/technician/settings" className="text-blue-200/50 text-xs hover:text-white">
              ตั้งค่า
            </a>
            <button onClick={logout} className="text-blue-200/50 text-xs hover:text-white">
              ออกจากระบบ
            </button>
          </div>
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
            {/* Offers */}
            <section>
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">notifications_active</span>
                งานที่เสนอมาให้คุณ ({offers.length})
              </h2>
              {offers.length === 0 ? (
                <p className="text-blue-200/30 text-sm">ยังไม่มีงานเสนอเข้ามา</p>
              ) : (
                <div className="space-y-3">
                  {offers.map((o) => (
                    <div
                      key={o.offer_id}
                      className="bg-[#111a3b] border border-orange-400/30 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold">#{o.request_number}</span>
                        {o.is_express && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                            ด่วน
                          </span>
                        )}
                      </div>
                      <p className="text-blue-100 text-sm">{o.device_type || "-"} {o.note ? `— ${o.note}` : ""}</p>
                      <p className="text-blue-200/50 text-xs mt-1">
                        {o.distance_km ? `ห่าง ${o.distance_km} กม.` : ""}
                        {o.fee_total ? ` • ประมาณ ${o.fee_total} บาท` : ""}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => acceptOffer(o.offer_id)}
                          disabled={busyId === o.offer_id}
                          className="flex-1 bg-lime-400 text-black font-bold py-3 rounded-xl disabled:opacity-50"
                        >
                          รับงาน
                        </button>
                        <button
                          onClick={() => rejectOffer(o.offer_id)}
                          disabled={busyId === o.offer_id}
                          className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* My jobs */}
            <section>
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">work</span>
                งานของฉัน ({mineJobs.length})
              </h2>
              {mineJobs.length === 0 ? (
                <p className="text-blue-200/30 text-sm">ยังไม่มีงานที่รับไว้</p>
              ) : (
                <div className="space-y-3">
                  {mineJobs.map((j) => (
                    <div key={j.id} className="bg-[#111a3b] border border-blue-400/20 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold">#{j.request_number}</span>
                        <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                          {j.status}
                        </span>
                      </div>
                      <p className="text-blue-100 text-sm">{j.customer_name} — {j.device_type || j.service_name || "-"}</p>
                      <p className="text-blue-200/50 text-xs mt-0.5">{j.address}</p>
                      <div className="flex gap-2 mt-3">
                        {j.status === "accepted" && (
                          <button
                            onClick={() => updateJobStatus(j.id, "in_progress")}
                            disabled={busyId === String(j.id) + "in_progress"}
                            className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                          >
                            เริ่มงาน
                          </button>
                        )}
                        {j.status === "in_progress" && (
                          <button
                            onClick={() => updateJobStatus(j.id, "completed")}
                            disabled={busyId === String(j.id) + "completed"}
                            className="flex-1 bg-lime-400 text-black font-bold py-3 rounded-xl disabled:opacity-50"
                          >
                            จบงาน
                          </button>
                        )}
                        <button
                          onClick={() => updateJobStatus(j.id, "cancelled")}
                          disabled={busyId === String(j.id) + "cancelled"}
                          className="bg-white/10 text-white/70 font-bold py-3 px-4 rounded-xl disabled:opacity-50"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Available jobs */}
            <section>
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-white/40">list_alt</span>
                งานว่างในระบบ ({availableJobs.length})
              </h2>
              {availableJobs.length === 0 ? (
                <p className="text-blue-200/30 text-sm">ไม่มีงานว่างตอนนี้</p>
              ) : (
                <div className="space-y-3">
                  {availableJobs.map((j) => (
                    <div key={j.id} className="bg-[#111a3b] border border-white/10 rounded-2xl p-4">
                      <span className="text-white font-bold">#{j.request_number}</span>
                      <p className="text-blue-100 text-sm mt-1">{j.device_type || j.service_name || "-"}</p>
                      <p className="text-blue-200/50 text-xs mt-0.5">{j.address}</p>
                      <button
                        onClick={() => acceptAvailableJob(j.id)}
                        disabled={busyId === String(j.id)}
                        className="w-full mt-3 bg-lime-400 text-black font-bold py-3 rounded-xl disabled:opacity-50"
                      >
                        รับงานนี้
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
