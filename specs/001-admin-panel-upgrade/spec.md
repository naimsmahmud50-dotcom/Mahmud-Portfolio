# Feature Specification: Full Admin Panel CRUD & Server-Side Auth Upgrade

## 1. Problem Statement
The current admin dashboard has mock authentication (`sessionStorage` check), read-only project views, static lead placeholders, and no ability to edit or manage the live site sections (Site Settings, Hero, About, Skills, Projects, Services, Testimonials, Experience, Messages Inbox).

## 2. Goals & Success Criteria
1. **Server-Side Authentication:** Robust password verification, signed `httpOnly` session cookies, middleware route protection, and 401 guards on all admin endpoints.
2. **Complete Section Coverage:** Dedicated CRUD screens for:
   - Site Settings (channels, contact info, SEO metadata, OG image)
   - Hero Section (headlines, badges, bio excerpts, availability pill)
   - About Section (story paragraphs, profile avatar upload, CV download link)
   - Skills (categorized list, add, edit, reorder, show/hide)
   - Projects (case studies, full details, screenshots upload, tech stack, reorder, show/hide)
   - Services (capabilities, deliverables array, reorder, show/hide)
   - Testimonials (client quote, author, company, avatar, reorder, show/hide)
   - Experience (career milestones, role, period, technologies, reorder, show/hide)
   - Messages Inbox (incoming client inquiries, read/unread states, delete)
3. **Media Management:** Secure `/api/upload` route validating MIME type and file size, saving to `/public/uploads/`.
4. **Interactive Polish:** Modal/Drawer forms, loading states, real-time toast feedback, delete confirmation dialogs, and instant cache revalidation.

## 3. Non-Goals / Out of Scope
- Multi-user RBAC (this is a dedicated single-owner admin console for Mahmud Hasan).
- External payment gateway configurations.

## 4. Acceptance Criteria
- Given unauthenticated request to `/admin` or `/api/upload`, Then server responds with redirect to `/admin/login` or `401 Unauthorized`.
- Given valid admin passkey, When submitting login, Then server sets `httpOnly` cookie and grants access.
- Given any item in Projects, Skills, Services, Testimonials, or Experience, When clicking Move Up or Move Down, Then item `order` updates in DB and list re-renders.
- Given an image file uploaded via the form, When valid PNG/JPG/WebP/SVG <= 5MB, Then server saves it to `/public/uploads` and updates the image field with preview.
- Given a message in the inbox, When clicking Mark Read or Delete, Then status updates or record is removed with confirmation.
