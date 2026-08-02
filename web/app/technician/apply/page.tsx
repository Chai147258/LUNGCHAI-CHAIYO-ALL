"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function TechnicianApplyPage() {
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    phone: "",
    email: "",
    line_id: "",
    address: "",
    province: "ชลบุรี",
    district: "หนองใหญ่",
    subdistrict: "",
    skills: "",
    bank_name: "",
    bank_account_no: "",
    bank_account_name: "",
    tax_id: "",
    note: "",
  });
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; registration_no?: string } | null>(
    null
  );

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File, label: string): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `partner-applications/${label}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) {
      console.error(error);
      return null;
    }
    return path;
  }

  async function handleSubmit() {
    setResult(null);

    if (!form.full_name || !form.phone) {
      setResult({ success: false, message: "กรอกชื่อและเบอร์โทรให้ครบก่อน" });
      return;
    }
    if (!idCardFile) {
      setResult({ success: false, message: "กรุณาแนบรูปบัตรประชาชน" });
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setResult({ success: false, message: "กรุณายอมรับข้อตกลงทั้งสองข้อก่อนส่งใบสมัคร" });
      return;
    }

    setSubmitting(true);

    const idCardPath = await uploadFile(idCardFile, "idcard");
    const portraitPath = portraitFile ? await uploadFile(portraitFile, "portrait") : null;

    if (!idCardPath) {
      setSubmitting(false);
      setResult({ success: false, message: "อัปโหลดรูปบัตรประชาชนไม่สำเร็จ ลองใหม่อีกครั้ง" });
      return;
    }

    const { data, error } = await supabase.rpc("submit_partner_registration", {
      p_partner_type_id: 3, // ช่างบริการ
      p_full_name: form.full_name,
      p_business_name: form.business_name || null,
      p_phone: form.phone,
      p_email: form.email || null,
      p_line_id: form.line_id || null,
      p_address: form.address || null,
      p_province: form.province || null,
      p_district: form.district || null,
      p_subdistrict: form.subdistrict || null,
      p_latitude: null,
      p_longitude: null,
      p_skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
      p_id_card_path: idCardPath,
      p_portrait_path: portraitPath,
      p_bank_name: form.bank_name || null,
      p_bank_account_no: form.bank_account_no || null,
      p_bank_account_name: form.bank_account_name || null,
      p_note: form.note || null,
      p_agree_terms: agreeTerms,
      p_tax_id: form.tax_id || null,
      p_agree_privacy: agreePrivacy,
    });

    setSubmitting(false);

    if (error || !data?.success) {
      setResult({ success: false, message: data?.message || "ส่งใบสมัครไม่สำเร็จ ลองใหม่อีกครั้ง" });
      return;
    }
    setResult({ success: true, message: data.message, registration_no: data.registration_no });
  }

  if (result?.success) {
    return (
      <main className="min-h-screen bg-[#0a1128] flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <span className="material-symbols-outlined text-6xl text-lime-400 mb-4 block">check_circle</span>
          <h1 className="text-white font-bold text-xl mb-2">ส่งใบสมัครสำเร็จ</h1>
          <p className="text-blue-200/60 text-sm mb-1">เลขที่ใบสมัคร: {result.registration_no}</p>
          <p className="text-blue-200/60 text-sm">{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1128] px-5 py-10">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-white">engineering</span>
          </div>
          <h1 className="text-white font-bold text-2xl">สมัครเป็นช่าง/ร้านค้าพันธมิตร</h1>
          <p className="text-blue-200/50 text-sm mt-1">LUNGCHAI CHAIYO ALL — เครือข่ายช่างมืออาชีพ</p>
        </div>

        <div className="bg-[#111a3b] border border-blue-400/20 rounded-2xl p-6 space-y-5">
          <FormSection title="ข้อมูลส่วนตัว / ร้าน">
            <Field label="ชื่อ-นามสกุล *" value={form.full_name} onChange={(v) => set("full_name", v)} />
            <Field label="ชื่อร้าน (ถ้ามี)" value={form.business_name} onChange={(v) => set("business_name", v)} />
            <Field label="เบอร์โทรศัพท์ *" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
            <Field label="LINE ID" value={form.line_id} onChange={(v) => set("line_id", v)} />
            <Field label="ทักษะ/บริการ (คั่นด้วยจุลภาค)" value={form.skills} onChange={(v) => set("skills", v)} />
          </FormSection>

          <FormSection title="ที่อยู่">
            <Field label="ที่อยู่" value={form.address} onChange={(v) => set("address", v)} />
            <div className="grid grid-cols-3 gap-2">
              <Field label="ตำบล" value={form.subdistrict} onChange={(v) => set("subdistrict", v)} />
              <Field label="อำเภอ" value={form.district} onChange={(v) => set("district", v)} />
              <Field label="จังหวัด" value={form.province} onChange={(v) => set("province", v)} />
            </div>
          </FormSection>

          <FormSection title="ยืนยันตัวตน (จำเป็น)">
            <FileField label="รูปบัตรประชาชน *" onChange={setIdCardFile} />
            <FileField label="รูปถ่ายหน้าตรงคู่บัตร" onChange={setPortraitFile} />
            <Field
              label="เลขบัตรประชาชน / เลขผู้เสียภาษี"
              value={form.tax_id}
              onChange={(v) => set("tax_id", v)}
            />
          </FormSection>

          <FormSection title="บัญชีธนาคาร (สำหรับรับเงิน)">
            <Field label="ธนาคาร" value={form.bank_name} onChange={(v) => set("bank_name", v)} />
            <Field label="เลขบัญชี" value={form.bank_account_no} onChange={(v) => set("bank_account_no", v)} />
            <Field label="ชื่อบัญชี" value={form.bank_account_name} onChange={(v) => set("bank_account_name", v)} />
          </FormSection>

          <div className="border-t border-blue-400/20 pt-4 space-y-3">
            <a
              href="/technician/agreement"
              target="_blank"
              className="text-orange-400 text-sm underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">description</span>
              อ่านข้อตกลงสำหรับช่าง/ร้านค้าพันธมิตร (ค่าธรรมเนียม, กฎร้องเรียน, รีวิว, ภาษี)
            </a>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <span className="text-blue-100 text-sm">
                ข้าพเจ้ายอมรับข้อตกลงการเป็นช่าง/ร้านค้าพันธมิตร รวมถึงค่าบริการแพลตฟอร์ม 30%,
                กฎการร้องเรียน/ระงับ/ยกเลิกสิทธิ์, ระบบให้คะแนนรีวิว และภาระภาษีของตนเอง
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <span className="text-blue-100 text-sm">
                ข้าพเจ้ายินยอมให้เก็บ รวบรวม และใช้ข้อมูลส่วนบุคคล (รวมถึงเอกสารยืนยันตัวตน) ตาม{" "}
                <a href="/privacy" target="_blank" className="text-orange-400 underline">
                  นโยบายความเป็นส่วนตัว
                </a>
              </span>
            </label>
          </div>

          {result && !result.success && (
            <p className="text-red-400 text-sm text-center">{result.message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-colors"
          >
            {submitting ? "กำลังส่งใบสมัคร..." : "ส่งใบสมัคร"}
          </button>
        </div>
      </div>
    </main>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-blue-200/70 text-xs font-bold uppercase tracking-wide mb-2.5">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[11px] text-blue-200/50 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a1128] border border-blue-400/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-400"
      />
    </div>
  );
}

function FileField({ label, onChange }: { label: string; onChange: (f: File | null) => void }) {
  return (
    <div>
      <label className="text-[11px] text-blue-200/50 block mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="w-full text-xs text-blue-200/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-bold"
      />
    </div>
  );
}
