import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = "gemini-flash-latest"; // alias — always points to Google's current recommended Flash model

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

function buildSystemPrompt(context: string) {
  return `คุณคือ "ลุงชัย AI" ผู้ช่วยแชทประจำเว็บไซต์ของ Lungchai Chaiyo Group (lungchaichaiyo.shop) ธุรกิจกลุ่มจากประเทศไทยที่ให้บริการ IT/เครือข่าย (Network Farm IT Solution), อุปกรณ์โรงงานอุตสาหกรรม, PPE, สินค้า OTOP, เครื่องแบบ/ชุดยูนิฟอร์ม, สินค้าอุปโภคในบ้าน และบริการซ่อมบำรุง/ติดตั้งครบวงจร (One Stop Industrial & IT Solution)

บทบาทและวิธีทำงาน — ทำตามลำดับนี้ทุกครั้งที่ลูกค้าแจ้งปัญหาหรือถามราคา:

ขั้นที่ 1 — จับคู่ปัญหากับบริการให้ตรง:
- อ่านอาการ/คำถามของลูกค้า แล้วจับคู่กับรายการใน "ฐานความรู้ปัญหา/อาการ" และ "รายการบริการ" ด้านล่างที่ตรงที่สุด (ห้ามเดาบริการที่ไม่มีในฐานข้อมูล)
- ถ้าอาการยังไม่ชัดพอจะจับคู่บริการได้แม่นยำ ให้ถามคำถามสั้นๆ 1 ข้อเพื่อความชัดเจนก่อน

ขั้นที่ 2 — คำนวณค่าใช้จ่ายรวมให้ครบทุกรายการที่เกี่ยวข้อง โดยอ้างอิงจากตาราง "รายการบริการ" เท่านั้น:
- ค่าบริการ/ซ่อมพื้นฐาน (normal_price หรือช่วงราคาประเมินจากฐานความรู้)
- ค่าตรวจเช็คหน้างาน (inspection_fee ถ้ามี)
- ค่าเดินทาง = ระยะทาง (กม.) × อัตราค่าเดินทางต่อกม. (travel_price_per_km) — ถ้าลูกค้ายังไม่แจ้งพื้นที่/ระยะทาง ให้ถามก่อนคำนวณค่าเดินทาง (ถามแค่ครั้งเดียวพอ ถ้าลูกค้าไม่ทราบให้ประเมินแบบกว้างและระบุว่าเป็นค่าประมาณ)
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
    if (!GEMINI_API_KEY) {
      return json({ error: "GEMINI_API_KEY ยังไม่ได้ตั้งค่าใน Supabase secrets" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];
    let sessionId = typeof body.session_id === "string" ? body.session_id : null;

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

    const context = await buildKnowledgeContext();

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
        system_instruction: { parts: [{ text: buildSystemPrompt(context) }] },
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

    if (sessionId) {
      await supabase.from("ai_chat_messages").insert({ session_id: sessionId, sender: "bot", message: reply });
    }

    return json({ reply, session_id: sessionId });
  } catch (err) {
    console.error("lungchai-ai-chat error:", err);
    return json({ error: String(err) }, 500);
  }
});
