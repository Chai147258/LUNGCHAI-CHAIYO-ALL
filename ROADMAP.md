> ⚠️ **เอกสารนี้ถูกแทนที่แล้ว (2026-08-01)** — เขียนขึ้นตอนวางแผนเสิร์ฟเว็บแบบ static ผ่าน GitHub Pages
> ปัจจุบันเว็บจริงรันบน **Vercel/Next.js** (build จากโฟลเดอร์ `web/` เท่านั้น) โฟลเดอร์ `main/`,
> `user/`, `technician/`, `admin/` ที่กล่าวถึงในเอกสารนี้เป็นไฟล์กำพร้า ไม่มีผลกับเว็บจริงแล้ว
> **ดูโครงสร้างปัจจุบันที่ [`NEXTJS_ARCHITECTURE.md`](./NEXTJS_ARCHITECTURE.md) แทน**

---

# Roadmap ย้ายโครงสร้างเว็บไซต์ — Lungchai Chaiyo Group
### ใช้คู่กับ ARCHITECTURE.md — ติ๊กเช็คทีละข้อตอนลงมือจริง

> เป้าหมาย: ย้ายจากไฟล์แบนราบที่ root ไปเป็นโครงสร้างโฟลเดอร์ตามสิทธิ์ (`main/`, `user/`, `technician/`, `admin/`)
> โดยเว็บไม่ล่มและไม่มีลิงก์ตายแม้แต่ช่วงสั้นๆ ระหว่างย้าย

---

## Phase 0 — เตรียมการ (ยังไม่แตะไฟล์เดิม)

- [x] สร้างโฟลเดอร์ใหม่ทั้งหมด: `main/`, `user/`, `technician/`, `admin/`, `redirects/` (ไฟล์ยังว่าง)
- [x] เขียน `assets/js/auth-guard.js` (เช็ค session + role ตาม `data-zone`) และทดสอบแยกก่อนใช้จริง
- [x] สำรอง repo ปัจจุบันทั้งหมด (tag หรือ branch `pre-restructure-backup`) ก่อนแก้อะไรทั้งสิ้น
- [x] เตรียม GitHub token ให้พร้อมใช้งาน

---

## Phase 1 — ย้ายโซนสาธารณะก่อน (`main/`) — เสี่ยงน้อยสุด ไม่ต้อง login

- [x] คัดลอก (ยังไม่ลบต้นทาง) เข้า `main/`: `catalog.html`, `services.html`, `about.html`, `inquiry.html`,
      `lc_ai.html`, `find-technician.html`, `technician-finder.html`, `technician-profile.html`
- [x] แก้ path asset ในไฟล์เหล่านี้เป็น absolute (`/assets/...`)
- [x] แก้ `<a href>` ภายในกลุ่มนี้ให้ชี้กันเองถูกต้อง (เช่น catalog → services)
- [x] สร้าง `main/index.html` เป็นหน้าแรกโซนสาธารณะ
- [x] ทดสอบเปิดทุกหน้าใน `main/` จริงบนเบราว์เซอร์ (มือถือ + คอม) ก่อนลบไฟล์เดิม
- [x] สร้าง stub redirect ที่ตำแหน่งเดิมของไฟล์กลุ่มนี้ → ชี้ไป `main/...`
- [x] ค่อยลบไฟล์ต้นทางที่ root (เฉพาะกลุ่มนี้)

---

## Phase 2 — โซนลูกค้า (`user/`) — ต้อง login

- [x] คัดลอกเข้า `user/`: `member.html` → เปลี่ยนชื่อเป็น `login.html`, `service-request.html`
- [x] ติดตั้ง `auth-guard.js` (`data-zone="user"`) ในทั้งสองไฟล์ ยกเว้น `login.html` เอง
- [x] สร้าง `user/index.html` เป็นแดชบอร์ดสมาชิก
- [x] แก้ path asset + ลิงก์ภายในให้ครบ
- [x] ทดสอบ: login จริง → เข้าแดชบอร์ด → แจ้งซ่อม → ติดตามงานด้วยเลข SR ครบวงจร
- [x] ทดสอบเคส "ยังไม่ login แล้วพยายามเข้าหน้านี้ตรงๆ" ต้องเด้งไป login ไม่ใช่เข้าได้เฉยๆ
- [x] สร้าง stub redirect ที่ตำแหน่งเดิม (`/member.html`, `/service-request.html`)
- [x] ลบไฟล์ต้นทางที่ root (เฉพาะกลุ่มนี้)

---

## Phase 3 — โซนช่าง (`technician/`) — login ด้วยเบอร์ + PIN

- [x] คัดลอกเข้า `technician/`: `technician-portal.html` → เปลี่ยนชื่อเป็น `index.html`,
      `technician-apply.html` (คงไว้ที่ `main/technician-apply.html` เพราะเป็นหน้าสาธารณะล้วน), หน้าจัดการผลงาน (built-in ในหน้า index.html เดียวกัน ไม่แยกไฟล์ portfolio.html)
- [x] ติดตั้ง auth-guard (`data-zone="technician"`) ทุกไฟล์ยกเว้น `apply.html` (สมัครได้โดยไม่ login)
- [x] แก้ path asset + ลิงก์ภายในให้ครบ
- [x] ทดสอบ: login ช่างจริงด้วยเบอร์+PIN → รับงาน → ปิดงาน → อัปโหลดผลงานพอร์ตโฟลิโอ
- [x] ทดสอบสมัครช่างใหม่ผ่าน `apply.html` จนจบ flow อนุมัติ
- [x] สร้าง stub redirect ที่ `/technician-portal.html`, `/technician-apply.html`
- [x] ลบไฟล์ต้นทางที่ root (เฉพาะกลุ่มนี้)

> **หมายเหตุ (2026-07-29):** Phase 0-3 ตรวจสอบและปิดงานจริงแล้ว — `technician-portal.html` เปลี่ยนชื่อเป็น `technician/index.html` + สร้าง stub redirect ที่ path เดิม, แก้ลิงก์ที่ `main/technician-finder.html`, `main/technician-apply.html`, `admin.html` ให้ชี้มาที่ path ใหม่ครบแล้ว

---

## Phase 4 — โซนแอดมิน (`admin/`) — เสี่ยงสูงสุด ทำท้ายสุด

- [ ] คัดลอก `admin.html` → `admin/index.html`
- [ ] แยกเนื้อหาภายในเป็นเมนูย่อยตามที่ตกลง: Products, Orders, Users, Content (CMS), CRM
- [ ] ติดตั้ง auth-guard (`data-zone="admin"`) — ใช้ `is_admin()` ตรวจสิทธิ์จริงจาก Supabase
- [ ] ทดสอบ login ด้วยบัญชี admin จริง (chai147258@gmail.com) ครบทุกเมนูย่อย
- [ ] ทดสอบเคส "login เป็น user ธรรมดาแล้วพยายามเข้า /admin/" ต้องถูกบล็อก
- [ ] สร้าง stub redirect ที่ `/admin.html`
- [ ] ลบไฟล์ต้นทางที่ root

---

## Phase 5 — ปิดงานทั้งหมด

- [ ] ไล่เช็คทุกลิงก์ในทุกหน้าอีกรอบ (ไม่มีลิงก์ตาย ไม่มี path เก่าหลงเหลือ)
- [ ] เช็ค index.html (แลนดิ้งเพจจริง) ว่าปุ่ม Home ยังชี้ไป `main/index.html` ถูกต้อง
- [ ] เช็คว่า AI chatbot widget (`lungchai-launcher.js`) โหลดได้ครบทุกหน้าใหม่
- [ ] Commit + push เข้า `main` branch ทีเดียว พร้อมข้อความสรุปการย้าย
- [ ] เก็บ branch `pre-restructure-backup` ไว้อย่างน้อย 30 วันเผื่อต้อง rollback

---

## กติกาเสริมระหว่างทำ

- ห้ามลบไฟล์ต้นทางก่อนทดสอบไฟล์ปลายทางผ่านจริง
- ทำทีละ Phase ให้จบ ทดสอบผ่านค่อยไป Phase ถัดไป ห้ามข้ามลำดับ
- ถ้าติดปัญหาระหว่าง Phase ไหน หยุดที่ Phase นั้น อย่าลากยาวไป Phase ถัดไปทั้งที่ยังไม่ผ่าน
