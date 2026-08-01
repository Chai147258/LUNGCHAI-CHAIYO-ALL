# สถาปัตยกรรมเว็บไซต์ ลุงชัยไชโย กรุ๊ป — เวอร์ชัน Next.js/Vercel
### เอกสารแทนที่ ARCHITECTURE.md และ ROADMAP โครสร้างเว็ปไซน์ (ฉบับ static/GitHub Pages)

**สถานะเอกสารเดิม:** `ARCHITECTURE.md` และ `Roadmap โครสร้างเว็ปไซน์.md` เขียนขึ้นตอนที่เว็บยังวางแผนเสิร์ฟแบบ
static HTML ผ่าน GitHub Pages (โฟลเดอร์ `main/`, `user/`, `technician/`, `admin/` ที่ root ของ repo)
**แผนนั้นถูกแทนที่แล้ว** — ปัจจุบันโดเมน `lungchaichaiyo.shop` ชี้ไปที่ **Vercel** ซึ่ง build จากโฟลเดอร์
`web/` (Next.js) เท่านั้น ไฟล์ static ที่ root ของ repo (`main/*.html`, `technician/*.html`, `user/*.html`,
`admin.html` ฯลฯ) **เป็นไฟล์กำพร้า ไม่มีผลกับเว็บจริงอีกต่อไป** แต่ยังไม่ลบทิ้งเพื่อความปลอดภัยระหว่างเปลี่ยนผ่าน

---

## 1. ความจริงของสถาปัตยกรรมปัจจุบัน

```
GitHub (Chai147258/LUNGCHAI-CHAIYO-ALL, branch: main)
        │
        │  Vercel เชื่อม Git Integration — push เข้า main = deploy production อัตโนมัติ
        ▼
Vercel Project: lungchai-chaiyo-all (prj_9B5CkqJI3Zt2py8NqYWciJ94WUXb)
  Root Directory: web/          ← Vercel มองเห็นแค่โฟลเดอร์นี้ ไฟล์นอกนี้ไม่ถูก build
  Framework: Next.js (App Router)
        │
        ▼
Domain: lungchaichaiyo.shop, www.lungchaichaiyo.shop
```

**กติกาที่ต้องจำ:** จากนี้ไปทุกหน้าเว็บที่จะ "ขึ้นจริง" ต้องอยู่ใน `web/app/.../page.tsx`
ไฟล์ `.html` แบบเก่า **ห้ามใช้เป็นข้อมูลอ้างอิงว่าเว็บหน้าตาเป็นยังไง** เพราะไม่ได้ถูกเสิร์ฟแล้ว

---

## 2. โครงสร้างปัจจุบันของ `web/app/` (ณ วันที่เขียนเอกสารนี้)

```
web/
├── app/
│   ├── layout.tsx              root layout (font, meta, <body> ดำ)
│   ├── globals.css             theme: bg #02020c, lime-400 accent, Space Grotesk + Noto Sans Thai
│   ├── page.tsx                🌐 หน้าแรก (landing, YouTube embed, chatbot section)
│   ├── login/page.tsx          🌐 login ลูกค้า (Supabase Auth)
│   ├── register/page.tsx       🌐 สมัครสมาชิกลูกค้า
│   ├── technicians/page.tsx    🌐 ไดเรกทอรีช่าง + กรองทักษะ/พื้นที่ (เพิ่งสร้าง)
│   ├── admin/page.tsx          🛡️ admin (ต้องตรวจสอบว่ามี auth guard จริงหรือยัง)
│   └── admin/
│       ├── dashboard/page.tsx  🛡️ แดชบอร์ดแอดมิน
│       └── landing/page.tsx    🛡️ ตั้งค่าหน้า landing (ผูกกับ landing_page_settings)
├── lib/supabase.ts             Supabase client (ใช้ NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)
└── public/assets/lungchai-launcher.js   widget แชท AI (inject ผ่าน <Script>)
```

**ของเก่าที่ยังไม่มีใน Next.js เลย (ต้องสร้างใหม่ ไม่ใช่ "ย้าย"):**
- หน้าแจ้งซ่อม/ติดตามงาน (`user/service-request.html` เดิม)
- แดชบอร์ดสมาชิก (`user/index.html` เดิม)
- ระบบร้องเรียน (`user/complaint.html` เดิม)
- พอร์ทัลช่าง/ล็อกอินช่าง (`technician/index.html`, `technician-portal.html` เดิม)
- สมัครช่าง (`technician-apply.html` เดิม)
- โปรไฟล์ช่างสาธารณะ (`technician-profile.html` เดิม)
- ระบบจับคู่ช่างอัตโนมัติ (`find-technician.html` เดิม)
- แคตาล็อกสินค้า/บริการ/เกี่ยวกับเรา/ติดต่อ (`catalog.html`, `services.html`, `about.html`, `inquiry.html`)
- แชท AI แบบเต็มจอ (`lc_ai.html` — ตอนนี้มี `web/public/lc_ai.html` เป็น static อยู่ แยกจาก Next.js app)

**หมายเหตุไฟล์ขยะที่เจอใน repo (`A.m`, `A.h`, `D.n`, `Dm.k`) — ดูเหมือนไฟล์ที่ถูกสร้างผิดพลาด
(อาจมาจากเครื่องมือ AI coding ตัวที่สอง) แนะนำให้ลบทิ้งเมื่อสะดวก ไม่กระทบการ build**

---

## 3. หลักการออกแบบ 3 ข้อ (ยังใช้ได้เหมือนเดิม แค่เปลี่ยนกลไก)

**หลักที่ 1 — โครงสร้าง route = ระดับสิทธิ์การเข้าถึง**
ใน Next.js App Router ใช้ **Route Groups** แทนโฟลเดอร์แบบ static:
```
web/app/
├── (public)/                    ← วงเล็บ = ไม่ปรากฏใน URL จริง ใช้จัดกลุ่มเฉยๆ
│   ├── page.tsx                 → /
│   ├── technicians/page.tsx     → /technicians
│   ├── catalog/page.tsx         → /catalog
│   └── services/page.tsx        → /services
├── (user)/
│   ├── layout.tsx                ← ใส่ auth check ตรงนี้ที่เดียว ครอบคลุมทุกหน้าลูก
│   ├── dashboard/page.tsx        → /dashboard
│   └── service-request/page.tsx  → /service-request
├── (technician)/
│   ├── layout.tsx
│   ├── portal/page.tsx           → /portal
│   └── apply/page.tsx            → /apply  (ไม่ต้อง login — วางไว้นอก layout guard)
└── admin/
    ├── layout.tsx                ← มีอยู่แล้วบางส่วน ต้องเพิ่ม is_admin() check
    ├── dashboard/page.tsx
    └── landing/page.tsx
```

**หลักที่ 2 — auth guard อยู่ที่ `layout.tsx` ของกลุ่ม ไม่ใช่เช็คซ้ำทุกหน้า**
นี่คือของเดิมที่ยังใช้ได้ แค่เปลี่ยนจาก "auth-guard.js สคริปต์แยก" เป็น React Server/Client Component
pattern: `layout.tsx` ของแต่ละ route group เรียก `supabase.auth.getSession()` (หรือเช็ค role จาก
`profiles.role` สำหรับ admin) แล้ว `redirect()` ไปหน้า login ถ้าไม่ผ่าน — เขียนครั้งเดียวในไฟล์เดียว
ลูกหลานทุกหน้าใน route group นั้นได้ผลอัตโนมัติ

**หลักที่ 3 — ใช้ convention ของ Next.js เอง ไม่ประดิษฐ์ชื่อเอง**
`page.tsx` ในแต่ละโฟลเดอร์ = หน้าแรกของ route นั้น (เหมือนหลักการเดิมของ `index.html`)
ไม่ต้องมี `main/index.html` แบบเก่าอีกต่อไป

---

## 4. ตารางแผนย้าย/สร้างใหม่ (แทนตารางเดิมในข้อ 6 ของ ARCHITECTURE.md)

| ของเดิม (static, กำพร้าแล้ว) | ปลายทางใหม่ใน `web/app/` | สถานะ |
|---|---|---|
| `main/technician-finder.html` | `technicians/page.tsx` | ✅ สร้างแล้ว (live) |
| `main/catalog.html` | `(public)/catalog/page.tsx` | 🔴 ยังไม่สร้าง |
| `main/services.html` | `(public)/services/page.tsx` | 🔴 ยังไม่สร้าง |
| `main/about.html` | `(public)/about/page.tsx` | 🔴 ยังไม่สร้าง |
| `main/inquiry.html` | `(public)/contact/page.tsx` | 🔴 ยังไม่สร้าง |
| `main/lc_ai.html` | ใช้ widget เดิม (`lungchai-launcher.js`) ฝังในหน้าอื่นแทน หรือทำ `/chat/page.tsx` เต็มจอ | 🔴 ยังไม่สร้าง |
| `main/find-technician.html` | รวมเข้ากับ `technicians/page.tsx` (เพิ่มโหมด auto-match) หรือแยก `technicians/match/page.tsx` | 🔴 ยังไม่สร้าง |
| `main/technician-profile.html` | `technicians/[id]/page.tsx` (dynamic route) | 🔴 ยังไม่สร้าง |
| `user/login.html` | `login/page.tsx` | ✅ มีอยู่แล้ว (คนละดีไซน์แต่ทำหน้าที่เดียวกัน) |
| `user/index.html` | `(user)/dashboard/page.tsx` | 🔴 ยังไม่สร้าง |
| `user/service-request.html` | `(user)/service-request/page.tsx` | 🔴 ยังไม่สร้าง |
| `user/complaint.html` | `(user)/complaint/page.tsx` (หรือ public ถ้าไม่ต้อง login) | 🔴 ยังไม่สร้าง |
| `technician/index.html` / `technician-portal.html` | `(technician)/portal/page.tsx` | 🔴 ยังไม่สร้าง |
| `technician/technician-apply.html` | `(technician)/apply/page.tsx` (public) | 🔴 ยังไม่สร้าง |
| `admin.html` | `admin/page.tsx` + `admin/dashboard/page.tsx` | 🟡 มีโครงแล้ว ต้องเช็ค auth guard จริง |

---

## 5. สิ่งที่ต้องเช็คก่อนทำต่อ (สำคัญมาก)

1. **`web/app/admin/` มี auth guard จริงหรือยัง?** ต้องอ่านโค้ดปัจจุบันก่อนเพิ่มหน้าใหม่ ถ้ายังไม่มี
   ต้องทำก่อนเป็นอันดับแรก เพราะ risk สูงสุด (ตรงกับ Phase 4 เดิมที่บอกว่า "เสี่ยงสูงสุด ทำท้ายสุด" —
   แต่ตอนนี้กลับความสำคัญ: **auth guard ต้องมาก่อนเพิ่มฟีเจอร์ ไม่ใช่ทำท้ายสุด** เพราะ Next.js
   ทุกหน้า public โดย default ถ้าไม่เขียน guard เอง)
2. **ไฟล์ static เก่าที่ root repo — ลบเมื่อไหร่?** แนะนำ **ยังไม่ลบตอนนี้** เผื่อใช้เป็น reference
   เนื้อหา/ข้อความ (copy ข้อความ, โครงสร้างสินค้า ฯลฯ) มาเขียนใหม่ใน Next.js แต่ **ห้ามลิงก์หาไฟล์
   เหล่านี้จากหน้า Next.js ใดๆ** เพราะจะพาไปหน้าที่ไม่มีการดูแลแล้ว
3. **`web/public/lc_ai.html`** — เป็น static file แยกที่ยังทำงานได้ (เพราะอยู่ใต้ `public/` ของ Next.js
   ซึ่ง Vercel เสิร์ฟตรงๆ) แต่ไม่ได้ใช้ดีไซน์ระบบเดียวกับหน้า Next.js อื่น — ต้องตัดสินใจว่าจะคงไว้
   แบบนี้ หรือย้ายเป็น React page

---

## 6. ลำดับพัฒนาแนะนำ (แทน Phase 0-5 เดิม)

| ลำดับ | งาน | เหตุผลที่มาก่อน |
|---|---|---|
| 1 | ตรวจ/ทำ auth guard ของ `admin/` และวาง pattern `layout.tsx` guard ให้เป็นแบบมาตรฐาน | ป้องกันช่องโหว่ก่อนเพิ่มหน้าใหม่ทับ |
| 2 | สร้าง `(user)/service-request/page.tsx` + `(user)/dashboard/page.tsx` | ฟีเจอร์หลักที่ลูกค้าใช้บ่อยสุด ตรงกับ Phase 1 เดิมของ Blueprint |
| 3 | สร้าง `(technician)/portal/page.tsx` + `apply/page.tsx` | ให้ช่างที่เพิ่มเข้าระบบ (6 คนล่าสุด) ใช้งานได้จริงผ่านเว็บ ไม่ใช่แค่หน้าร้าน |
| 4 | สร้าง `technicians/[id]/page.tsx` (โปรไฟล์ช่างสาธารณะ) | ต่อยอดจาก `/technicians` ที่มีแล้ว |
| 5 | สร้างหน้า catalog/services/about/contact | เนื้อหาการตลาด ความเร่งด่วนต่ำกว่าฟังก์ชันข้างต้น |

---

## 7. เอกสารที่ถูกแทนที่

- `ARCHITECTURE.md` (เดิม) — แนวคิดหลักที่ยังใช้ได้ (การแยกสิทธิ์ตามโฟลเดอร์) แต่กลไกเปลี่ยนหมด
- `Roadmap โครสร้างเว็ปไซน์.md` (เดิม) — Phase 1-5 ทั้งหมดอ้างอิง GitHub Pages ซึ่งไม่ใช่ช่องทางเสิร์ฟจริงแล้ว

ทั้งสองไฟล์จะไม่ลบ แต่ใส่ประกาศ "เอกสารนี้ถูกแทนที่แล้ว" ไว้ด้านบนสุด ชี้มาที่ไฟล์นี้แทน
