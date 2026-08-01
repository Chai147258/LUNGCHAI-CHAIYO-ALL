> ⚠️ **เอกสารนี้ถูกแทนที่แล้ว (2026-08-01)** — เขียนขึ้นตอนวางแผนเสิร์ฟเว็บแบบ static ผ่าน GitHub Pages
> ปัจจุบันเว็บจริงรันบน **Vercel/Next.js** (build จากโฟลเดอร์ `web/` เท่านั้น) โฟลเดอร์ `main/`,
> `user/`, `technician/`, `admin/` ที่กล่าวถึงในเอกสารนี้เป็นไฟล์กำพร้า ไม่มีผลกับเว็บจริงแล้ว
> **ดูโครงสร้างปัจจุบันที่ [`NEXTJS_ARCHITECTURE.md`](./NEXTJS_ARCHITECTURE.md) แทน**

---

สถาปัตยกรรมเว็บไซต์ ลุงชัยไชโย กรุ๊ป (Lungchai Chaiyo Group)
เอกสารสำหรับทีม IT — อ่านจบแล้วเข้าใจโครงสร้างทั้งหมด
เวอร์ชัน 2.0 — เอกสารนี้เป็น "คำตัดสินสุดท้าย" ไม่ใช่ตัวเลือกให้เลือก เขียนขึ้นเพื่อให้พนักงาน IT
คนใหม่เข้ามารับช่วงต่อได้ทันทีโดยไม่ต้องถามใคร
1. หลักการออกแบบ 3 ข้อที่ยึดตลอดทั้งเว็บ
หลักที่ 1 — โครงสร้างโฟลเดอร์ = ระดับสิทธิ์การเข้าถึง ไม่ใช่หมวดหมู่เนื้อหา
ถามคำถามเดียวก่อนวางไฟล์ทุกครั้ง: "หน้านี้ต้อง login ไหม และ login ด้วยสิทธิ์อะไร"
ไม่ใช่ถามว่า "หน้านี้พูดเรื่องอะไร" — เพราะเรื่อง "ช่าง" มีทั้งหน้าที่ลูกค้าดู (สาธารณะ) และหน้าที่ช่างใช้ทำงาน (ต้อง login)
สองอย่างนี้อยู่คนละโฟลเดอร์เสมอ แม้จะพูดเรื่องเดียวกัน
หลักที่ 2 — ทุกโฟลเดอร์มีการ์ดตรงประตูเดียว
โฟลเดอร์ที่ต้อง login (user/, technician/, admin/) จะเช็คสิทธิ์ที่ไฟล์เดียว (shared auth guard script)
ไม่ใช่เช็คซ้ำในทุกไฟล์ — ลดจุดพลาด ลดโค้ดซ้ำ แก้ทีเดียวมีผลทั้งโฟลเดอร์
หลักที่ 3 — ใช้ convention มาตรฐานเว็บ ไม่ประดิษฐ์ชื่อเอง
folder/index.html คือ "หน้าแรกของโฟลเดอร์" ตามมาตรฐานเว็บทุกเซิร์ฟเวอร์ (รวม GitHub Pages) —
พิมพ์แค่ lungchaichaiyo.shop/main/ ก็เปิด main/index.html เองอัตโนมัติ ไม่ต้องมีคำต่อท้ายแบบ
index_main.html ให้จำยาก นี่คือการแก้ไขจากดราฟต์ก่อนหน้า เพราะชื่อไฟล์เฉพาะกิจทำให้คนใหม่งงว่า
ทำไมแต่ละที่ชื่อไม่เหมือนกัน
2. โครงสร้างโฟลเดอร์สุดท้าย
Code
หมายเหตุการสะกด: เปลี่ยนจาก technicien (ภาษาฝรั่งเศส/พิมพ์ผิด) เป็น technician (อังกฤษถูกต้อง)
ให้ตรงกับชื่อไฟล์/ตารางฐานข้อมูลที่ใช้อยู่แล้ว (technicians, technician_credentials ฯลฯ) เพื่อไม่ให้สับสน
3. คำตัดสินในแต่ละประเด็นที่เคยค้างไว้
ประเด็น
คำตัดสิน
เหตุผล
ชื่อไฟล์หน้าแรกแต่ละโฟลเดอร์
ใช้ index.html ทุกที่ ไม่ใช่ index_xx.html
มาตรฐานเว็บ, GitHub Pages รองรับอัตโนมัติ, คนใหม่เข้าใจทันทีไม่ต้องสอน
cmr / CRM
ใช้ชื่อ crm.html แปะไว้ใน admin/ ไม่แยกโฟลเดอร์
จำนวนหน้ายังน้อย (Phase 3 เพิ่งเริ่ม) แยกโฟลเดอร์ตอนนี้จะบริหารยากเกินจำเป็น
admin กับ cms แยกกันไหม
ไม่แยก — รวมเป็นระบบ Admin เดียว, login ครั้งเดียว, มีเมนูภายในแยกส่วน
ทีม IT มีคนเดียว/ไม่กี่คน การดูแล 2 ระบบ auth คู่ขนานเพิ่มความเสี่ยงบั๊กโดยไม่ได้ประโยชน์เพิ่ม ถ้าธุรกิจโตจนต้องแยกทีมจัดการเนื้อหากับทีมหลังบ้านจริงๆ ค่อยแยกทีหลังได้
find-technician.html / technician-finder.html / technician-profile.html อยู่โซนไหน
ย้ายเข้า main/ ทั้งหมด
ลูกค้าดูได้โดยไม่ login = สาธารณะเสมอ ตามหลักที่ 1
ลิงก์เก่าที่เคยแจกไปแล้ว
สร้างไฟล์ stub ที่ path เดิม เป็น <meta http-equiv="refresh"> เด้งไปที่ใหม่
GitHub Pages ไม่มี server-side redirect ต้องใช้ HTML meta-refresh แทน
Path ของ asset (JS/รูป/anon key)
ใช้ path ขึ้นต้นด้วย / เสมอ เช่น /assets/js/lungchai-launcher.js
ใช้ได้ทุกความลึกโฟลเดอร์ ไม่ต้องนับ ../../ ให้งง
4. Auth Guard Pattern (สำหรับพนักงาน IT ที่จะเพิ่มหน้าใหม่ในอนาคต)
ทุกหน้าในโซน user/, technician/, admin/ ต้องมีสคริปต์นี้เป็นบรรทัดแรกใน <head> หรือต้นๆ ของ <body>:
Html
auth-guard.js มีหน้าที่เดียว: เช็ค session ปัจจุบันกับ Supabase, เช็ค data-zone ตรงกับ role
(admin→profiles.role, user→ session ปกติ, technician→ technician_credentials)
ถ้าไม่ผ่าน → เด้งไปหน้า login ของโซนนั้นทันที ห้ามเขียน logic เช็คสิทธิ์ซ้ำในแต่ละไฟล์
เพราะจะเป็นจุดที่มือใหม่ลืมเช็คแล้วเกิดช่องโหว่ (เคยเจอปัญหานี้มาแล้วกับ admin.html
ที่เช็ค profile.member_type ที่ไม่มีอยู่จริง)
5. ไฟล์ stub สำหรับลิงก์เก่า (ตัวอย่าง)
Html
ทำแบบนี้ไว้ทุกไฟล์ที่เคยส่ง URL ตรงออกไปแล้ว (LINE OA, โบรชัวร์, โพสต์ Facebook เก่า)
6. ตารางย้ายไฟล์ (ปลายทางที่แน่นอน)
ไฟล์เดิม (root)
ปลายทางใหม่
catalog.html
main/catalog.html
services.html
main/services.html
about.html
main/about.html
inquiry.html
main/inquiry.html
lc_ai.html
main/lc_ai.html
find-technician.html
main/find-technician.html
technician-finder.html
main/technician-finder.html
technician-profile.html
main/technician-profile.html
member.html
user/login.html (+ stub ที่เดิม)
service-request.html
user/service-request.html (+ stub ที่เดิม)
technician-portal.html
technician/index.html
technician-apply.html
technician/apply.html (+ stub ที่เดิม)
admin.html
admin/index.html
index.html
ไม่ย้าย ไม่แก้
7. ขั้นตอนถัดไป
ผมออกแบบและตัดสินใจให้ครบตามนี้แล้ว พร้อมลงมือได้ทันทีที่ลุงชัยพร้อม — สิ่งที่ต้องมีก่อนเริ่มจริง
คือ GitHub token (session นี้ไม่มีให้ผมส่งเข้าไปได้) เมื่อพร้อมแล้วบอก "ทำต่อ" ได้เลย ผมจะ:
สร้างโฟลเดอร์และย้ายไฟล์ตามตารางข้อ 6
แก้ path asset ทุกไฟล์เป็น absolute
แก้ลิงก์ <a href> ที่ชี้ข้ามหน้าทั้งหมดให้ตรงปลายทางใหม่
สร้างไฟล์ stub ตามข้อ 5
ทดสอบทุกลิงก์ก่อน push เข้า main branch จริง