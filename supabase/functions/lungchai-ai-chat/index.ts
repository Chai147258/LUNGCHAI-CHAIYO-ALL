import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = "gemini-flash-latest"; // alias — always points to Google's current recommended Flash model
const MAPS_API_KEY = Deno.env.get("MAPS_API_KEY"); // optional — falls back to straight-line distance if unset

// Shop reference point: 227, Nong Yai, Nong Yai District, Chonburi 20190
const SHOP_LAT = 13.14;
const SHOP_LNG = 101.39;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getDistanceKm(destLat: number, destLng: number): Promise<{ km: number; source: "road" | "straight-line" }> {
  if (MAPS_API_KEY) {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${SHOP_LAT},${SHOP_LNG}` +
        `&destinations=${destLat},${destLng}&mode=driving&key=${MAPS_API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const el = data?.rows?.[0]?.elements?.[0];
        if (el?.status === "OK" && typeof el.distance?.value === "number") {
          return { km: Math.round((el.distance.value / 1000) * 10) / 10, source: "road" };
        }
      }
    } catch (err) {
      console.error("Distance Matrix error:", err);
    }
  }
  const km = Math.round(haversineKm(SHOP_LAT, SHOP_LNG, destLat, destLng) * 10) / 10;
  return { km, source: "straight-line" };
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function buildKnowledgeContext(): Promise<string> {
  const [kbRes, servicesRes, pricesRes, feesRes] = await Promise.all([
    supabase.from("ai_knowledge_base")
      .select("service_type,problem_keyword,symptom,possible_causes,solution,estimated_min,estimated_max")
      .limit(50),
    supabase.from("services")
      .select("name,normal_price,express_price,duration_normal,duration_express,inspection_fee,travel_price_per_km,platform_fee_percent,after_hours_fee,holiday_fee,service_area,sla_hours")
      .eq("is_active", true)
      .limit(60),
    supabase.from("service_price_catalog")
      .select("service_name,starting_price,inspection_fee")
      .eq("active", true)
      .limit(50),
    supabase.from("service_fee_rules")
      .select("rule_name,rule_type,price,is_percentage")
      .eq("is_active", true)
      .limit(30),
  ]);

  const kb = kbRes.data ?? [];
  const services = servicesRes.data ?? [];
  const prices = pricesRes.data ?? [];
  const fees = feesRes.data ?? [];

  let ctx = "";
  if (kb.length) {
    ctx += "ฐานความรู้ปัญหา/อาการ (service_type | คำค้น | อาการ | สาเหตุที่เป็นไปได้ | แนวทางแก้ | ช่วงราคาประเมิน บาท):\n";
    for (const r of kb) {
      ctx += `- ${r.service_type} | ${r.problem_keyword} | ${r.symptom} | ${r.possible_causes ?? "-"} | ${r.solution} | ${r.estimated_min}-${r.estimated_max}\n`;
    }
  }
  if (services.length) {
    ctx += "\nรายการบริการพร้อมโครงสร้างค่าใช้จ่ายทั้งหมด (ชื่อบริการ | ราคาปกติ | ราคาด่วน | เวลาปกติ/ด่วน | ค่าตรวจเช็คหน้างาน | ค่าเดินทางต่อกม. | ค่าธรรมเนียมแพลตฟอร์ม% | ค่านอกเวลา | ค่าวันหยุด | พื้นที่ให้บริการ | SLA ชม.):\n";
    for (const r of services) {
      ctx += `- ${r.name} | ${r.normal_price ?? "-"} บาท | ด่วน ${r.express_price ?? "-"} บาท | ${r.duration_normal ?? "-"}/${r.duration_express ?? "-"} | ตรวจเช็ค ${r.inspection_fee ?? 0} บาท | เดินทาง ${r.travel_price_per_km ?? 0} บาท/กม. | แพลตฟอร์ม ${r.platform_fee_percent ?? 0}% | นอกเวลา +${r.after_hours_fee ?? 0} | วันหยุด +${r.holiday_fee ?? 0} | พื้นที่ ${r.service_area ?? "ทั่วไป"} | SLA ${r.sla_hours ?? "-"} ชม.\n`;
    }
  }
  if (prices.length) {
    ctx += "\nตารางราคาเริ่มต้นบริการ (สำรอง กรณีไม่พบใน services ด้านบน):\n";
    for (const r of prices) {
      ctx += `- ${r.service_name} | เริ่มต้น ${r.starting_price} บาท | ค่าตรวจเช็ค ${r.inspection_fee ?? 0} บาท\n`;
    }
  }
  if (fees.length) {
    ctx += "\nกฎค่าธรรมเนียมเพิ่มเติม (ใช้เสริมกรณีไม่มีในตาราง services):\n";
    for (const r of fees) {
      ctx += `- ${r.rule_name} (${r.rule_type}): ${r.price}${r.is_percentage ? "%" : " บาท"}\n`;
    }
  }
  return ctx || "(ยังไม่มีข้อมูลราคาในระบบ ให้ตอบแบบกว้างๆ และแนะนำให้ติดต่อทีมงานเพื่อประเมินราคาที่แน่นอน)";
}

/**
 * Deterministic pre-match against ai_diagnosis_rules + ai_knowledge_base via the
 * match_customer_symptom() Postgres function (exact/synonym match = 1.0, else
 * trigram fuzzy fallback). This runs BEFORE the Gemini call so the model gets a
 * grounded, high-confidence starting point instead of guessing from raw text —
 * fewer hallucinated causes/prices, faster convergence to the right diagnosis.
 */
async function getSymptomMatches(message: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.rpc("match_customer_symptom", {
      p_message: message,
      p_limit: 3,
    });
    if (error) {
      console.error("match_customer_symptom rpc error:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("match_customer_symptom call failed:", err);
    return [];
  }
}

function buildSymptomMatchSection(matches: any[]): string {
  if (!matches.length) return "";
  let s = "\nผลจับคู่อาการเบื้องต้นจากระบบวิเคราะห์อัตโนมัติ (ai_diagnosis_rules, เรียงจากมั่นใจมากไปน้อย — ใช้เป็นข้อมูลตั้งต้นก่อนตอบ ห้ามขัดแย้งกับข้อมูลนี้โดยไม่มีเหตุผล):\n";
  for (const m of matches) {
    const pct = Math.round((m.match_score ?? 0) * 100);
    s += `- [ตรงกับ "${m.keyword}" ${pct}%] ${m.service_type}: สาเหตุที่เป็นไปได้ = ${m.diagnosis}` +
      (m.questions ? `; คำถามยืนยันก่อนสรุป = "${m.questions}"` : "") +
      (m.solution ? `; วิธีแก้ = ${m.solution}` : "") +
      (m.estimated_min != null ? `; เวลาโดยประมาณ = ${m.estimated_min}-${m.estimated_max} นาที` : "") +
      (m.skill_required ? `; ต้องใช้ = ${m.skill_required}` : "") + "\n";
  }
  s += "วิธีใช้ผลนี้: ถ้ารายการแรกตรง ≥60% ให้ยึดเป็นสมมติฐานหลัก และถามคำถามยืนยันของรายการนั้นก่อน (ถ้ายังไม่ได้ถาม) ก่อนสรุปวิธีแก้และราคา ถ้าทุกรายการตรง <60% ให้ถือว่ายังไม่ชัดเจน ให้ถามลูกค้าอธิบายอาการเพิ่มแทนการฟันธง\n";
  return s;
}

function buildSystemPrompt(context: string, symptomMatchSection: string) {
  return `คุณคือ "ลุงชัย AI" ผู้ช่วยแชทประจำเว็บไซต์ของ Lungchai Chaiyo Group (lungchaichaiyo.shop) ธุรกิจกลุ่มจากประเทศไทยที่ให้บริการ IT/เครือข่าย (Network Farm IT Solution), อุปกรณ์โรงงานอุตสาหกรรม, PPE, สินค้า OTOP, เครื่องแบบ/ชุดยูนิฟอร์ม, สินค้าอุปโภคในบ้าน และบริการซ่อมบำรุง/ติดตั้งครบวงจร (One Stop Industrial & IT Solution)

บทบาทและวิธีทำงาน — ทำตามลำดับนี้ทุกครั้งที่ลูกค้าแจ้งปัญหาหรือถามราคา:

ขั้นที่ 1 — จับคู่ปัญหากับบริการให้ตรง:
- ดูผลจับคู่อาการอัตโนมัติด้านล่างก่อนเป็นอันดับแรก (ถ้ามี) แล้วจึงอ่านอาการ/คำถามของลูกค้าประกอบกับ "ฐานความรู้ปัญหา/อาการ" และ "รายการบริการ" ด้านล่างที่ตรงที่สุด (ห้ามเดาบริการที่ไม่มีในฐานข้อมูล)
- ถ้าอาการยังไม่ชัดพอจะจับคู่บริการได้แม่นยำ ให้ถามคำถามสั้นๆ 1 ข้อเพื่อความชัดเจนก่อน (ใช้คำถามยืนยันจากผลจับคู่อัตโนมัติถ้ามีให้)
${symptomMatchSection}

ขั้นที่ 2 — คำนวณค่าใช้จ่ายรวมให้ครบทุกรายการที่เกี่ยวข้อง โดยอ้างอิงจากตาราง "รายการบริการ" เท่านั้น:
- ค่าบริการ/ซ่อมพื้นฐาน (normal_price หรือช่วงราคาประเมินจากฐานความรู้)
- ค่าตรวจเช็คหน้างาน (inspection_fee ถ้ามี)
- ค่าเดินทาง = ระยะทาง (กม.) × อัตราค่าเดินทางต่อกม. (travel_price_per_km) — ถ้าข้อความลูกค้ามีระยะทางที่ยืนยันจาก GPS (ข้อความจะระบุว่า "แชร์ตำแหน่ง GPS แล้ว: ห่างจากร้านประมาณ X กม.") ให้ใช้ตัวเลขนั้นคำนวณได้ทันทีโดยไม่ต้องถามซ้ำ และแจ้งลูกค้าว่าเป็นระยะทางที่วัดจาก GPS (แม่นยำกว่าค่าประมาณเอง) ถ้ายังไม่มีข้อมูลระยะทางเลย ให้ถามพื้นที่/ระยะทางก่อน หรือแนะนำให้กดปุ่มแชร์ตำแหน่ง (ไอคอนหมุดข้างช่องพิมพ์) เพื่อคำนวณค่าเดินทางที่แม่นยำขึ้น (ถามแค่ครั้งเดียวพอ ถ้าลูกค้าไม่ทราบให้ประเมินแบบกว้างและระบุว่าเป็นค่าประมาณ)
- ค่าธรรมเนียมเพิ่มเติมถ้าเข้าเงื่อนไข: นอกเวลาทำการ (after_hours_fee), วันหยุด (holiday_fee), ค่าธรรมเนียมแพลตฟอร์ม (platform_fee_percent คิดเป็น % ของยอดบริการ) — ใส่เฉพาะรายการที่เกี่ยวข้อง
- ถ้าบริการมีทั้งราคาปกติและด่วน (express) ให้เสนอทั้งสองตัวเลือกพร้อมเวลาให้บริการ

ขั้นที่ 3 — สรุปให้ลูกค้าทราบเป็นรายการที่อ่านง่าย ทุกครั้งที่มีการประเมินราคา ใช้รูปแบบนี้:
📋 สรุปประเมินเบื้องต้น — [ชื่อบริการที่ตรงกับปัญหา]
• ค่าบริการ: xxx บาท
• ค่าตรวจเช็คหน้างาน: xxx บาท (ถ้ามี)
• ค่าเดินทาง (X กม. × Y บาท/กม.): xxx บาท (ถ้ามี)
• ค่าธรรมเนียมอื่นๆ: xxx บาท (เฉพาะที่เกี่ยวข้อง)
รวมประมาณ: xxx–xxx บาท
⏱ ระยะเวลา: ปกติ .../ด่วน ...
*ราคาสุดท้ายขึ้นกับการตรวจสอบหน้างานจริง

ขั้นที่ 4 — ปิดท้ายด้วยขั้นตอนถัดไปเสมอ เช่น แจ้งซ่อม/นัดหมายช่าง/ขอใบเสนอราคาอย่างเป็นทางการผ่าน lungchaichaiyo.shop

กติกาทั่วไป:
- ตอบเป็นภาษาเดียวกับที่ลูกค้าพิมพ์มาเสมอ (ไทย/อังกฤษ/จีน/ฯลฯ) รองรับหลายภาษาโดยอัตโนมัติ แต่ให้คงรูปแบบสรุป 📋 เหมือนเดิมแค่แปลข้อความ
- ห้ามแต่งตัวเลขราคาที่ไม่มีในฐานข้อมูลขึ้นมาเอง ถ้าไม่มีข้อมูลตรงกับบริการที่ถาม ให้บอกตามจริงและแนะนำให้ติดต่อทีมงานเพื่อขอราคาที่แน่นอน
- น้ำเสียงเป็นมิตร มืออาชีพ กระชับ อ่านง่ายบนมือถือ ถ้ายังไม่ถึงขั้นสรุปราคา ให้ตอบสั้น 2-4 บรรทัดพอ
- ถ้าลูกค้าถามเรื่องที่ไม่มีข้อมูลในระบบเลย, ปัญหาซับซ้อนเกินจะประเมินผ่านแชท, ลูกค้าดูหงุดหงิด/ไม่พอใจคำตอบ AI, หรือลูกค้าขอคุยกับคนจริงโดยตรง ให้แนะนำให้กดปุ่ม "คุยกับพนักงาน" มุมขวาบนของหน้าแชท (เชื่อมไปที่ LINE OA ของร้านโดยตรง) อย่างเป็นธรรมชาติ ไม่ต้องรอให้ถามซ้ำหลายรอบ

ฐานความรู้และราคาปัจจุบันจากระบบ:
${context}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json().catch(() => ({}));

    // --- Feedback submission (👍/👎 on a specific AI reply) — bypasses the AI call entirely ---
    if (body.feedback) {
      const fb = body.feedback;
      const messageId = typeof fb.message_id === "string" ? fb.message_id : null;
      const rating = fb.rating === 1 || fb.rating === -1 ? fb.rating : null;
      if (!messageId || rating === null) {
        return json({ error: "message_id and rating (1 or -1) are required" }, 400);
      }
      const comment = typeof fb.comment === "string" ? fb.comment.slice(0, 1000) : null;
      const { error: fbError } = await supabase
        .from("ai_feedback")
        .insert({ conversation_id: messageId, rating, comment });
      if (fbError) {
        console.error("ai_feedback insert error:", fbError);
        return json({ error: "Failed to save feedback" }, 500);
      }
      return json({ ok: true });
    }

    if (!GEMINI_API_KEY) {
      return json({ error: "GEMINI_API_KEY ยังไม่ได้ตั้งค่าใน Supabase secrets" }, 500);
    }

    const history = Array.isArray(body.history) ? body.history : [];
    let sessionId = typeof body.session_id === "string" ? body.session_id : null;

    let message = typeof body.message === "string" ? body.message.trim() : "";
    let distanceInfo: { km: number; source: "road" | "straight-line" } | null = null;

    const location = body.location;
    if (location && typeof location.lat === "number" && typeof location.lng === "number") {
      distanceInfo = await getDistanceKm(location.lat, location.lng);
      const sourceLabel = distanceInfo.source === "road" ? "ระยะทางถนนจริง (ขับรถ)" : "ระยะทางเส้นตรง (ประมาณ)";
      message =
        `📍 ลูกค้าแชร์ตำแหน่ง GPS แล้ว: ห่างจากร้านประมาณ ${distanceInfo.km} กม. (${sourceLabel}) ` +
        `กรุณาใช้ระยะทางนี้คำนวณค่าเดินทางให้เลยครับ` +
        (message ? `\n\nข้อความเพิ่มเติมจากลูกค้า: ${message}` : "");
    }

    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    if (!sessionId) {
      const { data: sessionData } = await supabase
        .from("ai_chat_sessions")
        .insert({ channel: "website_widget", status: "active" })
        .select("id")
        .single();
      sessionId = sessionData?.id ?? null;
    }

    if (sessionId) {
      await supabase.from("ai_chat_messages").insert({ session_id: sessionId, sender: "user", message });
    }

    const [context, symptomMatches] = await Promise.all([
      buildKnowledgeContext(),
      getSymptomMatches(message),
    ]);
    const symptomMatchSection = buildSymptomMatchSection(symptomMatches);

    // Gemini uses role "model" instead of "assistant", and contents/parts instead of messages/content
    const contents = [...history, { role: "user", content: message }].map(
      (m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }),
    );

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const aiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(context, symptomMatchSection) }] },
        contents,
        generationConfig: { maxOutputTokens: 1000 },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Gemini API error:", errText);
      return json({ error: "AI request failed", detail: errText }, 502);
    }

    const aiData = await aiRes.json();
    const reply =
      (aiData.candidates?.[0]?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? "")
        .join("\n")
        .trim() || "ขออภัยครับ ตอนนี้ระบบขัดข้องเล็กน้อย รบกวนลองใหม่อีกครั้งครับ";

    let botMessageId: string | null = null;
    if (sessionId) {
      const { data: botMsgData } = await supabase
        .from("ai_chat_messages")
        .insert({ session_id: sessionId, sender: "bot", message: reply })
        .select("id")
        .single();
      botMessageId = botMsgData?.id ?? null;
    }

    return json({
      reply,
      session_id: sessionId,
      message_id: botMessageId,
      distance_km: distanceInfo?.km ?? null,
      distance_source: distanceInfo?.source ?? null,
    });
  } catch (err) {
    console.error("lungchai-ai-chat error:", err);
    return json({ error: String(err) }, 500);
  }
});
