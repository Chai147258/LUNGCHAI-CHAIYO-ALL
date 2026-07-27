# LUNGCHAI CHAIYO ALL
# Database Audit Report & Master Blueprint V2.0

> **Version:** 2.0
> **Status:** Working Draft
> **Reference Database:** Supabase Production
> **Project:** hkwqrllqzfzsbsxqgaoo
> **Last Audit:** 2026-07-28

---

# หลักการ

เอกสารฉบับนี้ใช้ **Supabase Production Database** เป็น Source of Truth

หากข้อมูลในเอกสารออกแบบเดิม (Blueprint) ไม่ตรงกับฐานข้อมูลจริง
ให้ถือว่า **Schema ในฐานข้อมูลจริงเป็นข้อมูลอ้างอิงหลัก**

---

# สรุปผลการตรวจสอบ

## ผลการตรวจสอบ

- Database Status : Production
- Schema : public
- ตารางทั้งหมด : มากกว่า 160 ตาราง
- RLS : เปิดใช้งานเกือบทั้งหมด
- Source of Truth : Supabase Production

---

# Core Platform

## มีแล้ว

- companies
- company_profile
- branches
- profiles
- user_profiles
- roles
- permissions
- role_permissions
- admins
- admin_users
- admin_roles
- admin_logs
- audit_logs
- system_settings

สถานะ

✅ พร้อมใช้งาน

---

# CRM

มีแล้ว

- customers
- customer_addresses
- customer_contacts
- customer_accounts
- customer_notes
- customer_activity
- customer_devices
- customer_segments
- customer_segment_members
- contacts

สถานะ

✅ พร้อม

---

# Technician Platform

มีแล้ว

- technicians
- technician_codes
- technician_services
- technician_reviews
- technician_schedule
- technician_jobs
- technician_documents
- technician_credentials
- technician_sessions
- technician_portfolio
- technician_registrations
- erp_technicians

สถานะ

✅ พร้อม

---

# Partner Platform

มีแล้ว

- partner_profiles
- partner_types
- partner_locations
- partner_skills
- partner_reviews
- partner_documents
- partner_availability
- partner_vehicles
- partner_commissions
- partner_registrations

สถานะ

✅ พร้อม

---

# Service Platform

มีแล้ว

- service_requests
- erp_service_requests
- service_jobs
- service_logs
- service_history
- service_catalog
- service_categories
- services
- service_types
- service_images
- service_assignments
- service_confirmations
- service_request_updates

Business Rules

- service_workflows
- service_status_rules
- service_fee_rules
- service_sla_rules
- dispatch_rules
- service_zones

QR

- repair_job_qr
- qr_checkins

สถานะ

✅ พร้อม

---

# Appointment

มีแล้ว

- appointments
- appointment_slots

สถานะ

✅ พร้อม

---

# Work Order

มีแล้ว

- work_orders
- work_order_items
- job_tracking
- job_dispatch_offers

สถานะ

✅ พร้อม

---

# Quotation

มีแล้ว

- quotations
- quotation_items
- repair_quotes

สถานะ

✅ พร้อม

---

# Sales

มีแล้ว

- sales_orders
- sales_order_items
- sales_leads
- sales_pipeline

สถานะ

✅ พร้อม

---

# Product

มีแล้ว

- products
- erp_products
- product_groups
- product_images
- brands
- categories
- erp_categories

สถานะ

✅ พร้อม

---

# Inventory

มีแล้ว

- warehouses
- warehouse_stock
- stock_movements
- inventory_transactions

สถานะ

✅ พร้อม

---

# Purchasing

มีแล้ว

- suppliers

สถานะ

✅ พร้อม

---

# Asset

มีแล้ว

- assets
- asset_assignments

สถานะ

🟡 ยังขยายได้

---

# HR

มีแล้ว

- employees
- departments
- positions
- attendance_records
- overtime_records
- payroll_transactions
- payroll_periods
- leave_requests
- leave_types

สถานะ

✅ พร้อม

---

# Finance

มีแล้ว

- invoices
- invoice_items
- payments
- subscriptions
- tax_documents

สถานะ

✅ พร้อม

---

# AI Platform

มีแล้ว

- ai_chat_sessions
- ai_chat_messages
- ai_conversations
- ai_messages
- ai_feedback
- ai_predictions
- ai_estimations
- ai_engine_results
- ai_learning
- ai_diagnosis_rules
- ai_test_cases
- ai_intents
- ai_job_generator_logs
- ai_mock_results
- ai_pricing_rules
- ai_repair_cases
- ai_knowledge_base

สถานะ

✅ พร้อมมาก

---

# Knowledge Base

มีแล้ว

- knowledge_base
- knowledge_categories
- service_knowledge_map

สถานะ

✅ พร้อม

---

# CMS

มีแล้ว

- cms_sections
- cms_business_units
- cms_contact_channels
- cms_gateway_buttons
- cms_service_highlights
- cms_stats
- cms_user_roles
- landing_content

สถานะ

✅ พร้อม

---

# Marketplace

มีแล้ว

- businesses
- carts
- cart_items
- orders
- order_items
- deliveries
- delivery_rounds

สถานะ

🟡 กำลังพัฒนา

---

# File Management

มีแล้ว

- files
- storage_files
- documents
- customer_files
- employee_documents

สถานะ

✅ พร้อม

---

# Notification

มีแล้ว

- notifications
- notification_logs

สถานะ

✅ พร้อม

---

# API

มีแล้ว

- api_tokens
- api_token_logs
- api_key_versions
- api_key_rotation
- api_key_rotation_jobs

สถานะ

✅ พร้อม

---

# ตารางที่ Blueprint ยังเสนอ แต่ฐานจริงยังไม่มี

Maintenance

- maintenance_contracts
- maintenance_logs
- maintenance_checklists
- maintenance_schedule

Preventive Maintenance

- pm_plans
- pm_checklists
- pm_reports

Equipment

- equipment_history

Warranty

- warranty_claims

Recommendation

ให้เพิ่มเมื่อเริ่มพัฒนา

Maintenance Module

---

# ตารางที่ไม่ควรสร้างซ้ำ

ห้ามสร้างซ้ำ

- technicians
- customers
- companies
- branches
- services
- service_requests
- erp_service_requests
- service_jobs
- work_orders
- quotations
- invoices
- payments
- products
- erp_products
- warehouses
- assets
- employees

ให้ใช้ของเดิมทั้งหมด

---

# Security Audit

พบ

public.spatial_ref_sys

ยังไม่ได้เปิด

Row Level Security (RLS)

หมายเหตุ

ยังไม่ควรเปิดใช้งานทันที
จนกว่าจะกำหนด Policies ครบ

---

# สรุป

ผลการตรวจสอบ

- ใช้ Supabase Production เป็นมาตรฐาน
- Schema จริงมีความสมบูรณ์มากกว่า Blueprint เดิม
- Blueprint จะต้องอัปเดตตามฐานจริง
- ไม่สร้างตารางซ้ำ
- เพิ่มเฉพาะโมดูลที่ยังไม่มี เช่น Maintenance / PM / Warranty

---

**Source of Truth**

Supabase Production Project