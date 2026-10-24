# Technical Implementation Plan: Admin Panel Upgrade

## 1. Architecture Overview
- **Auth Layer:** `lib/auth.ts` provides cookie signing/verification with HMAC-SHA256. `middleware.ts` guards `/admin/*` routes. API routes check `verifyAdmin(req)`.
- **Upload Route:** `app/api/upload/route.ts` parses multipart stream, validates file signature, writes to `/public/uploads/`.
- **Admin App Structure:**
  - `app/admin/layout.tsx`: Persistent admin shell with sidebar navigation, unread message count badge, user profile badge, and logout action.
  - `app/admin/page.tsx`: Unified dashboard hub with section navigation tabs, quick KPI counters, and active CRUD views.
  - Dedicated CRUD modals/components for:
    - `SettingsManager`: Site identity, contacts, social links, SEO.
    - `HeroManager`: Badges, name, intro texts, availability pill, roles.
    - `AboutManager`: Story copy, avatar upload, CV URL.
    - `SkillsManager`: Filter by category, add/edit, reorder (up/down), toggle featured.
    - `ProjectsManager`: Case studies list, add/edit modal with image upload, tech stack tags, highlights, reorder, toggle featured.
    - `ServicesManager`: Services list, add/edit modal, deliverables manager, reorder.
    - `TestimonialsManager`: Client reviews, add/edit, avatar upload, reorder.
    - `ExperienceManager`: Timeline milestones, tech tags, add/edit, reorder.
    - `MessagesInbox`: Inquiries table, read/unread status pills, message reader modal, delete confirmation.

## 2. API Endpoints
- `POST /api/admin/login` & `POST /api/admin/logout`
- `GET /api/admin/me`
- `POST /api/upload`
- `PATCH /api/projects/reorder`, `PATCH /api/skills/reorder`, `PATCH /api/services/reorder`, `PATCH /api/testimonials/reorder`, `PATCH /api/experiences/reorder`
- `PATCH /api/messages/[id]` (mark read/unread)
- All mutation handlers on `/api/*` protected with `verifyAdmin`.
