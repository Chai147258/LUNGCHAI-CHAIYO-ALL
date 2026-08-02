"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "lc_consent_v1";

export default function ConsentGate() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem(CONSENT_KEY);
      if (consented !== "true") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch {
      /* ignore storage errors, still let them through this session */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-2">ก่อนใช้งานเว็บไซต์</h2>
        <p className="text-white/60 text-sm mb-4">
          เว็บไซต์นี้เก็บและใช้ข้อมูลส่วนบุคคลของท่าน (เช่น เบอร์โทร ตำแหน่งที่ตั้ง รูปภาพประกอบการแจ้งซ่อม)
          เพื่อจับคู่ช่างและให้บริการตามที่ท่านร้องขอ กรุณาอ่านและยอมรับก่อนใช้งานต่อ
        </p>
        <div className="flex gap-4 text-xs mb-5">
          <a href="/privacy" target="_blank" className="text-lime-400 underline">
            นโยบายความเป็นส่วนตัว
          </a>
          <a href="/terms" target="_blank" className="text-lime-400 underline">
            ข้อกำหนดและเงื่อนไข
          </a>
        </div>
        <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-lime-400 flex-shrink-0"
          />
          <span className="text-white/70 text-sm">
            ข้าพเจ้าได้อ่านและยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้บริการแล้ว
          </span>
        </label>
        <button
          onClick={accept}
          disabled={!checked}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
            checked
              ? "bg-lime-400 text-black hover:brightness-95"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          ยอมรับและเริ่มใช้งาน
        </button>
      </div>
    </div>
  );
}
