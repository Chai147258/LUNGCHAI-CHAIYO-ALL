"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Technician = {
  id: number;
  full_name: string;
  phone: string | null;
  line_id: string | null;
  skill: string | null;
  photo_url: string | null;
  area: string | null;
};

type SkillGroup = {
  key: string;
  label: string;
  icon: string;
  match?: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
  { key: "all", label: "ทั้งหมด", icon: "apps" },
  { key: "it", label: "IT & Network", icon: "computer", match: ["it", "network", "computer", "server"] },
  { key: "printer", label: "เครื่องพิมพ์", icon: "print", match: ["printer", "เครื่องพิมพ์", "scanner"] },
  { key: "cctv", label: "กล้องวงจรปิด", icon: "videocam", match: ["cctv", "กล้อง", "access"] },
  { key: "electrical", label: "ไฟฟ้า/มอเตอร์", icon: "bolt", match: ["ไฟฟ้า", "มอเตอร์", "โรงงาน"] },
  { key: "auto", label: "รถยนต์/ยาง", icon: "directions_car", match: ["รถยนต์", "ยาง", "แบตเตอรี่", "ช่วงล่าง"] },
  { key: "fashion", label: "ตัดเย็บ/ผ้า", icon: "checkroom", match: ["ตัด", "เสื้อผ้า", "ยูนิฟอร์ม"] },
];

function matchesSkillGroup(techSkill: string | null, key: string): boolean {
  if (key === "all") return true;
  const group = SKILL_GROUPS.find((g) => g.key === key);
  if (!group?.match) return true;
  const skillLower = (techSkill || "").toLowerCase();
  return group.match.some((m) => skillLower.includes(m.toLowerCase()));
}

export default function TechniciansPage() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSkill, setActiveSkill] = useState("all");
  const [activeArea, setActiveArea] = useState("all");

  useEffect(() => {
    let active = true;
    supabase
      .from("technicians")
      .select("id, full_name, phone, line_id, skill, photo_url, area")
      .eq("active", true)
      .order("full_name", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error(error);
          setTechs([]);
        } else {
          setTechs(data || []);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const areaOptions = useMemo(() => {
    const areas = Array.from(new Set(techs.map((t) => t.area).filter(Boolean) as string[])).sort();
    const hasUnassigned = techs.some((t) => !t.area);
    const options = [{ key: "all", label: "ทุกพื้นที่" }, ...areas.map((a) => ({ key: a, label: a }))];
    if (hasUnassigned) options.push({ key: "__none", label: "ไม่ระบุพื้นที่" });
    return options;
  }, [techs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return techs.filter((t) => {
      const matchesSearch =
        !q || t.full_name.toLowerCase().includes(q) || (t.skill || "").toLowerCase().includes(q);
      const matchesSkill = matchesSkillGroup(t.skill, activeSkill);
      const matchesArea =
        activeArea === "all" || (activeArea === "__none" ? !t.area : t.area === activeArea);
      return matchesSearch && matchesSkill && matchesArea;
    });
  }, [techs, search, activeSkill, activeArea]);

  return (
    <main className="min-h-screen bg-black px-5 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://raw.githubusercontent.com/Chai147258/LUNGCHAI-CHAIYO-ALL/main/images/logo-all.jpg"
              alt="Lungchai Chaiyo All"
              className="w-9 h-9 rounded-lg object-cover border border-lime-400/40"
            />
            <span className="font-bold text-sm text-lime-400">LUNGCHAI CHAIYO ALL</span>
          </a>
          <a href="/" className="text-xs text-white/60 hover:text-lime-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">arrow_back</span> หน้าแรก
          </a>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] tracking-widest uppercase text-lime-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></span> Technician Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">ช่างซ่อมใกล้ฉัน</h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            เลือกช่างผู้เชี่ยวชาญตามงานที่ต้องการ ติดต่อได้โดยตรง หรือส่งคำขอผ่านระบบแจ้งซ่อม
          </p>
        </div>

        {/* Search + filter */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6">
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400"
              placeholder="ค้นหาชื่อช่าง หรือทักษะ เช่น เครื่องพิมพ์, กล้องวงจรปิด..."
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {SKILL_GROUPS.map((g) => (
              <button
                key={g.key}
                onClick={() => setActiveSkill(g.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  g.key === activeSkill
                    ? "bg-lime-400 text-black border-lime-400"
                    : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{g.icon}</span> {g.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <span className="material-symbols-outlined text-white/40 text-lg">location_on</span>
            <div className="flex flex-wrap gap-2">
              {areaOptions.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setActiveArea(o.key)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                    o.key === activeArea
                      ? "bg-lime-400 text-black border-lime-400"
                      : "border-white/15 text-white/60 hover:border-white/30"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16 text-white/40">กำลังโหลดรายชื่อช่าง...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-white/20 mb-3 block">engineering</span>
            <p className="text-white/40">ไม่พบช่างที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => {
              const skills = (t.skill || "").split(",").map((s) => s.trim()).filter(Boolean);
              const initials = t.full_name.replace(/^ช่าง[\s-]*/, "").trim().charAt(0) || "ช";
              return (
                <div
                  key={t.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-lime-400/40 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-400/30 to-sky-400/20 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 overflow-hidden">
                      {t.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{t.full_name}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] text-lime-400 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span> พร้อมรับงาน
                      </span>
                      {t.area && (
                        <span className="flex items-center gap-0.5 text-[10px] text-white/40 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          {t.area}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5 min-h-[26px]">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {t.phone && (
                      <a
                        href={`tel:${t.phone.replace(/-/g, "")}`}
                        className="flex-1 text-center bg-white/10 hover:bg-white/15 transition-colors text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">call</span> โทร
                      </a>
                    )}
                    {t.line_id && (
                      <a
                        href={`https://line.me/ti/p/~${t.line_id.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-[#06C755]/20 hover:bg-[#06C755]/30 transition-colors text-[#06C755] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">chat</span> LINE
                      </a>
                    )}
                  </div>
                  <a
                    href="/"
                    className="mt-2 block text-center bg-yellow-400 text-black text-xs font-bold py-2.5 rounded-xl hover:brightness-95 transition-all"
                  >
                    แจ้งซ่อมผ่านแชท AI
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <footer className="text-center text-[11px] text-white/30 py-10">
          © 2026 LUNGCHAI CHAIYO ALL — เครือข่ายช่างมืออาชีพ
        </footer>
      </div>
    </main>
  );
}
