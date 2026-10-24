# Task Breakdown: Admin Panel Upgrade

## Phase 1: Server-Side Authentication & Middleware Protection
- [ ] T001: Implement `lib/auth.ts` with HMAC-SHA256 session token generation and verification.
- [ ] T002: Create `app/api/admin/login/route.ts`, `app/api/admin/logout/route.ts`, and `app/api/admin/me/route.ts`.
- [ ] T003: Implement `middleware.ts` to protect `/admin` routes (redirect unauthenticated to `/admin/login`).
- [ ] T004: Protect mutation API endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) with 401 unauthenticated guard.
- [ ] T005: Update `app/admin/login/page.tsx` to use server-side login API and test authentication flow.

## Phase 2: Secure File Upload System
- [ ] T006: Create `public/uploads` directory.
- [ ] T007: Implement `app/api/upload/route.ts` with auth verification, MIME validation, 5MB limit, and UUID naming.
- [ ] T008: Verify upload endpoint with curl tests.

## Phase 3: Reorder & Status APIs
- [ ] T009: Add reorder and status toggle endpoints for Projects, Skills, Services, Testimonials, Experience, and Messages.

## Phase 4: Section 1 — Site Settings CRUD Screen
- [ ] T010: Build Site Settings editor (Email, WhatsApp, Telegram, Socials, SEO, OG Image upload).
- [ ] T011: Test Site Settings save and verify update on live site.

## Phase 5: Section 2 — Hero Section CRUD Screen
- [ ] T012: Build Hero editor (Badges, headlines, positioning, intro copy, availability pill, roles).
- [ ] T013: Test Hero save and verify update on live site.

## Phase 6: Section 3 — About Section CRUD Screen
- [ ] T014: Build About editor (Story paragraphs, avatar photo upload with preview, CV URL).
- [ ] T015: Test About save and verify update on live site.

## Phase 7: Section 4 — Skills Section CRUD Screen
- [ ] T016: Build Skills manager (Add, Edit, Delete with modal confirmation, Up/Down reordering, Featured toggle).
- [ ] T017: Test Skills CRUD and reorder.

## Phase 8: Section 5 — Projects Section CRUD Screen
- [ ] T018: Build Projects manager (Full modal editor, image upload for cover/mockup, stack tags, highlights, Up/Down reorder, Show/Hide toggle, Delete confirmation).
- [ ] T019: Test Projects CRUD, reorder, and image upload.

## Phase 9: Section 6 — Services Section CRUD Screen
- [ ] T020: Build Services manager (Add, Edit, Deliverables array editor, Up/Down reorder, Delete confirmation).
- [ ] T021: Test Services CRUD and reordering.

## Phase 10: Section 7 — Testimonials Section CRUD Screen
- [ ] T022: Build Testimonials manager (Add, Edit, Avatar upload, Quote text, Up/Down reorder, Delete confirmation).
- [ ] T023: Test Testimonials CRUD.

## Phase 11: Section 8 — Experience Section CRUD Screen
- [ ] T024: Build Experience manager (Add, Edit, Technologies array editor, Period, Company, Up/Down reorder, Delete confirmation).
- [ ] T025: Test Experience CRUD.

## Phase 12: Section 9 — Messages Inbox
- [ ] T026: Build Messages inbox (Table of inquiries, Read/Unread status badge toggle, View Message reader modal, Delete inquiry with confirmation).
- [ ] T027: Test Messages inbox actions.

## Phase 13: Final Polish, Build & Verification
- [ ] T028: Integrate responsive navigation shell in `app/admin/page.tsx` with toast notifications, KPI counters, and tab switching.
- [ ] T029: Run `npm run build` and verify 0 errors.
- [ ] T030: Execute end-to-end security and CRUD verification.
