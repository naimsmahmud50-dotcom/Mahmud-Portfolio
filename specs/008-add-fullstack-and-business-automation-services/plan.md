# Implementation Plan: Add Full Stack Development & Business Automation Services

**Feature ID:** `008-add-fullstack-and-business-automation-services`  
**Status:** In Progress  

---

## 1. Technical Context
- Portfolio services are defined in:
  - Static fallback: `lib/data.ts` (`defaultServices: ServiceData[]`)
  - Home Accordion fallback: `components/home/ServicesAccordion.tsx` (`fallbackServiceItems`)
  - Seed catalog: `prisma/seed.ts` (`servicesData`)
  - SQLite persistent database: `prisma/dev.db` (`Service` model)
  - Dedicated page: `app/services/page.tsx` (`iconMap` lookup)
  - Admin panel: `components/admin/ServicesManager.tsx`

## 2. Step-by-Step Execution Plan

### Step 1: Update `lib/data.ts`
- Add Service 7: Full Stack Development (id: `s7`, num: `07`, order: `7`, icon: `Layers`)
- Add Service 8: Business Automation (id: `s8`, num: `08`, order: `8`, icon: `Workflow`)

### Step 2: Update `prisma/seed.ts`
- Add both services with proper `titleEn`, `titleBn`, `descriptionEn`, `descriptionBn`, `deliverables`, `icon`, `order` to `servicesData`.

### Step 3: Insert / Upsert in SQLite database `prisma/dev.db`
- Execute a one-time migration script via `npx tsx` to insert or upsert services `s7` and `s8` with correct orders and values.
- Verify total service count is 8 and query returns all services ordered 1 to 8.

### Step 4: Update UI Component Fallbacks & Icon Mappings
- In `components/home/ServicesAccordion.tsx`: Add both services to `fallbackServiceItems`.
- In `app/services/page.tsx`: Import `Layers` and `Workflow` (plus `Bot`, `Code`) from `lucide-react` and add to `iconMap`.

### Step 5: Verification & Testing
- Run `npx tsx` script to verify `getServices()` returns 8 items with `s7` and `s8`.
- Run `npm run lint` and `npm run build` (check all static pages render without errors).

### Step 6: Git Commit & Push
- Commit: `feat(services): add full stack development and business automation services`
- Push to `origin main` to trigger Vercel deployment.
- Verify production endpoint response.
