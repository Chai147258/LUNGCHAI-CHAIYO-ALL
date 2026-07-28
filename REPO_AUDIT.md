# Audit ของจริงใน Repo — ก่อนย้ายโครงสร้าง (แทนที่ตารางเดิมในข้อ 6 ของ ARCHITECTURE.md)

> เช็คทุกไฟล์จริงใน GitHub main branch แล้ว (69 ไฟล์) เปิดดูเนื้อหาจริงทีละไฟล์ที่มีข้อสงสัย
> สรุป: มีไฟล์ "ทดลอง/ค้าง/พัง" ปนอยู่กับไฟล์จริงที่ใช้งานอยู่ค่อนข้างเยอะ ต้องคัดก่อนย้าย ไม่งั้นจะย้ายขยะติดไปด้วย

---

## ✅ ไฟล์จริงที่ใช้งานอยู่ (Live — ต้องย้ายตามแผน)

| ไฟล์ | ขนาด | สถานะ |
|---|---|---|
| `index.html` | 27KB | 🔒 แลนดิ้งเพจจริงบนโดเมน — **ไม่แตะ** |
| `main.html` | 73KB | เว็บหลักตัวจริง เนื้อหาครบ — ย้ายเข้า `main/index.html` |
| `admin.html` (root) | 89KB | แดชบอร์ดแอดมินตัวจริงที่ใช้งานอยู่ (login + is_admin() + จัดการสินค้า/ผู้ใช้) — ย้ายเข้า `admin/index.html` |
| `catalog.html` | 25KB | ย้ายเข้า `main/` |
| `services.html` | 26KB | ย้ายเข้า `main/` |
| `about.html` | 31KB | ย้ายเข้า `main/` |
| `inquiry.html` | 21KB | ย้ายเข้า `main/` |
| `lc_ai.html` | 59KB | หน้าแชท AI ตัวจริงที่เชื่อม Edge Function จริง — ย้ายเข้า `main/` |
| `member.html` | 23KB | ระบบสมาชิกตัวจริง — ย้ายเข้า `user/login.html` |
| `service-request.html` | 18KB | แจ้งซ่อมตัวจริง (มี tracking number) — ย้ายเข้า `user/` |
| `technician/technician-portal.html` | 24KB | พอร์ทัลช่างตัวจริง (login เบอร์+PIN) — ย้ายเข้า `technician/index.html` |
| `technician/technician-apply.html` | 27KB | ใบสมัครช่างตัวจริง — ย้ายเข้า `main/` (สาธารณะ) |
| `technician/technician-finder.html` | 11KB | ไดเรกทอรีช่างตัวจริง — ย้ายเข้า `main/` (สาธารณะ) |
| `technician/find-technician.html` | 23KB | หาช่างใกล้ฉันตัวจริง — ย้ายเข้า `main/` (สาธารณะ) |
| `technician/technician-profile.html` | 8KB | โปรไฟล์ช่างสาธารณะตัวจริง (ใช้ `get_technician_card()` ตามที่เคยสร้างไว้) — ย้ายเข้า `main/` |
| `technician/js/profile.js` | 1KB | สคริปต์คู่กับไฟล์ข้างบน — ตรวจว่าไฟล์ไหนเรียกใช้จริงก่อนย้าย |
| `assets/js/auth-guard.js` | 5KB | สร้างไว้แล้วในเซสชันนี้ (Phase 0) |
| `assets/lungchai-launcher.js` | 3KB | Widget แชท AI ที่ฝังทุกหน้า — คงตำแหน่งเดิม |
| `supabase/functions/lungchai-ai-chat/index.ts` | 22KB | Edge Function จริง ไม่เกี่ยวกับ frontend restructure — ไม่แตะ |
| `images/*.jpg` (ยกเว้น `Logo1.jpg`) | - | รูปภาพจริงที่ใช้อยู่ — คงตำแหน่งเดิม |
| `CNAME`, `robots.txt` | - | ไฟล์ระบบของ GitHub Pages — ไม่แตะ |

---

## 🗑️ ไฟล์ทดลอง/ค้าง/พัง (Dead code — แนะนำลบหรือเก็บเข้า archive แยก ไม่ย้ายปนกับของจริง)

| ไฟล์ | เหตุผลที่ตัดสินว่าเป็นของทิ้งร้าง |
|---|---|
| `technician/profile.html` (6KB) | **ซ้ำซ้อนกับ** `technician-profile.html` — คนละไฟล์ คนละ key แต่ทำหน้าที่เดียวกัน (โปรไฟล์ช่าง) ต้องเลือกใช้แค่ไฟล์เดียว |
| `admin/` (ทั้งโฟลเดอร์ — index.html, admin.html, admin-service.html, jobs.html, css/, js/) | เปิดดูแล้วเป็น **โครงร่างเปล่า** ("กำลังโหลด...", ลิงก์ไปหน้า `technicians.html`/`products.html`/`customers.html`/`reports.html`/`settings.html` ที่**ไม่มีอยู่จริงในระบบเลย**) คนละชุดกับ `admin.html` ตัวจริงที่ root ซึ่งสมบูรณ์กว่ามาก |
| `login.html` (root, 1KB) | เปิดโค้ดแล้วพบว่า anon key ยังเป็นข้อความ `"YOUR_SUPABASE_ANON_KEY"` **ไม่เคยใส่ค่าจริง** — ฟอร์มนี้ใช้งานไม่ได้ |
| `lungchaiai.html` (14KB) | ชื่อหน้าในโค้ดระบุตรงๆ ว่า "ลุงชัย AI — Prototype" — เป็นของทดลองรุ่นก่อน `lc_ai.html` ตัวจริง |
| `ai-repair/` (ทั้งโฟลเดอร์) | เปิดดู `app.js` พบเป็น **AI ปลอม** (เขียนเงื่อนไข if-else เช็คคำในข้อความ ไม่ได้เชื่อม Gemini/Supabase จริง) และ `style.css` เป็นไฟล์เปล่า (1 byte) |
| `js/service-request.js`, `js/service.js`, `js/repair.js`, `js/supabase.js` (โฟลเดอร์ `js/` ที่ root) | เปิดดู `service-request.js` พบ `"YOUR_SUPABASE_URL"`, `"YOUR_ANON_KEY"` เป็นข้อความ placeholder ที่ไม่เคยใส่ค่าจริง — ไฟล์ทดลองที่ไม่ได้ใช้งาน |
| `CMR/index.html`, `CMS/index.html`, `User/index.html` | ไฟล์เปล่า (1 byte) — เป็นแค่ placeholder ที่เคยสร้างไว้ (อาจจากการทดลองสร้างโฟลเดอร์ก่อนหน้านี้) ไม่มีเนื้อหาอะไรเลย |
| `Lungchaiai` (root, ไม่มีนามสกุลไฟล์) | ไฟล์เปล่า (1 byte) ชื่อไม่มี `.html` — เดาว่าเป็นไฟล์เสียจากการอัปโหลดผิดพลาด |
| `images/Logo1.jpg` | ไฟล์เปล่า (1 byte) — รูปเสีย/อัปโหลดไม่สำเร็จ |
| `9b13310753bc7ad73990fec7fa5c7780.png`, `af2c00d2094e585730bee07bb0d889ac.jpg` (root) | ชื่อไฟล์เป็น hash — ลักษณะไฟล์ที่ถูกแปะ/อัปโหลดจากการแชทแล้วติดเข้า repo โดยไม่ตั้งใจ ไม่มีหน้าไหนอ้างอิงถึง |

---

## 📄 เอกสาร/ไฟล์ระบบ (ไม่เกี่ยวกับโครงสร้างเว็บ — เก็บไว้เฉยๆ)

`README.md`, `ARCHITECTURE.md`, `LUNGCHAI_BLUEPRINT.md`, `LUNGCHAI_BLUEPRINT_V2`, `Database Audit Report & Master Blueprint V2.0.MD`, `Roadmap Database Audit Report & Master Blueprint V2.0.MD`, `2026-07-07-18-48-07.md`, `2026-07-07-19-42-38.md` — เป็นเอกสาร/บันทึกแผนงาน ไม่ใช่โค้ดเว็บ แนะนำย้ายรวมไว้ในโฟลเดอร์ `docs/` ให้เป็นระเบียบ (ไม่กระทบเว็บที่ใช้งานจริง)

---

## สรุปสิ่งที่ต้องตัดสินใจก่อนเริ่ม Phase 1 จริง

1. **ยืนยันลบไฟล์ dead code ทั้งหมดในตารางที่ 2** ก่อนย้าย — เพื่อไม่ให้ย้ายขยะติดไปกับโครงสร้างใหม่ (แนะนำ: ลบทิ้งเลย เพราะเทียบกับ branch สำรอง `pre-restructure-backup` ที่มีอยู่แล้ว กู้คืนได้เสมอถ้าจำเป็น)
2. **`technician/profile.html` vs `technician/technician-profile.html`** — เลือกใช้ไฟล์ไหนเป็นตัวจริง (แนะนำ `technician-profile.html` เพราะตรงกับระบบ Badge/รีวิวที่บันทึกไว้ว่าสร้างเสร็จแล้ว) แล้วลบอีกไฟล์ทิ้ง
3. **โฟลเดอร์ `admin/`** — แนะนำลบทิ้งทั้งโฟลเดอร์ (เป็นโครงร่างเปล่า ไม่ใช่ของจริง) แล้วใช้ `admin.html` (root) เป็นฐานเดียวในการย้ายเข้า `admin/index.html` แทน
