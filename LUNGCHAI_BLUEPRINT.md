# 🏗️ LUNGCHAI CHAIYO ALL — Web System Blueprint v2.0
## lungchaichaiyo.shop | Updated: July 2025

---

## ✅ COMPLETED — LIVE NOW

### Phase 1 — Landing Page ✅
- [x] index.html — Deep Space theme, Nebula Canvas
- [x] 7 แบรนด์จริง + 3 โลโก้
- [x] 8 ช่องทางขาย
- [x] Responsive Mobile/Tablet/Desktop
- [x] Deploy → lungchaichaiyo.shop

### Phase 2 — Core Pages ✅
- [x] catalog.html — แคตตาล็อกสินค้า 20 รายการ, ค้นหา, Filter, Modal
- [x] inquiry.html — ฟอร์มขอใบเสนอราคา (RFQ) → LINE OA
- [x] member.html — ระบบสมาชิก Login/Register/Dashboard

### Phase 3 — Backend API ✅
- [x] Node.js + Express
- [x] PostgreSQL Schema (members, points_log, addresses, orders)
- [x] JWT Auth (Register/Login/Verify)
- [x] Member Routes (Profile, Points, Tier, Address)
- [x] Admin Routes (Dashboard, Members, Points)
- [x] Orders Routes (Create, List, Get)
- [ ] Deploy → Render.com (pending)

---

## 🔧 PAGES STRUCTURE

```
lungchaichaiyo.shop/
├── index.html      ✅ Landing Page (Deep Space)
├── catalog.html    ✅ Product Catalog (20+ items)
├── inquiry.html    ✅ RFQ Form → LINE OA
├── member.html     ✅ Member System (JWT Auth)
└── admin.html      🔄 Admin Dashboard (next)
```

---

## 🚀 NEXT — Phase 3 Completion

### Deploy Backend (Render.com)
1. Push /lungchai-backend to GitHub repo ใหม่
2. Connect Render.com → New Web Service
3. Add PostgreSQL → run schema.sql
4. Get URL → update API constant in member.html + inquiry.html

### Phase 4 — Admin Dashboard
- [ ] admin.html — จัดการสมาชิก, orders, แต้ม
- [ ] Real-time stats
- [ ] Export รายงาน

### Phase 4 — LINE OA Chatbot
- [ ] Webhook server
- [ ] Auto-reply เมื่อมี inquiry
- [ ] แจ้งสมาชิกเมื่อได้รับแต้ม

---

## 🔑 BACKEND — Quick Deploy Guide

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/Chai147258/lungchai-backend.git
git push -u origin main

# 2. Render.com
# New Web Service → Connect GitHub
# Build: npm install | Start: npm start
# Add env: DATABASE_URL, JWT_SECRET

# 3. After deploy — update in member.html + inquiry.html:
const API = 'https://YOUR-APP.onrender.com/api';
```

---

## 🌐 SOCIAL CHANNELS

| Platform | URL |
|----------|-----|
| LINE OA | @971yzyyd |
| Shopee | collshp.com/run00 |
| Lazada | s.lazada.co.th/s.Z7iuvG |
| TikTok | @lungchai147258 |
| Facebook | facebook.com/lungchaishop1 |
| YouTube | youtube.com/@chai147258 |
| WhatsApp | wa.me/qr/QXD7536TVAPHG1 |

---

## 💎 7 BRANDS

| แบรนด์ | หมวด | โลโก้ |
|--------|------|--------|
| ลุงชัย ไชโย ออล | Flagship | logo-all.jpg |
| Network Farm IT Solution | IT/Network | Logo-ff.jpg |
| ลุงชัย รักษ์โลก | Eco/Green | logo-farm.jpg |
| ลุงชัย ของฝาก / OTOP | ของฝาก | - |
| Lungchai for Factories | B2B/อุตสาหกรรม | - |
| ลุงชัย บริการ | Service | - |
| ลุงชัย ไชโย (แฟชั่น) | Fashion | - |
| LUNGCHAI MARKAT | ตลาด/Online | - |

*Blueprint v2.0 | lungchaichaiyo.shop*
