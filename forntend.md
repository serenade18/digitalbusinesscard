# Digital Business Card SaaS — Frontend Specification (React + TypeScript)

> Companion document: `backend-spec.md` (Django REST Framework API, data model, infrastructure). This app is the **authenticated dashboard SPA only** — the public card page, `.vcf` export, QR image, and directory search are server-rendered by Django and are NOT part of this React app (see §1 and §7 below). All API calls in this app go through `/api/v1/...` as defined in the backend spec.

## 1. Scope of This App

The public VCard landing page, directory listing, and marketing site are server-rendered by Django for performance/SEO reasons (fast first paint, no auth dependency, JS not required for `.vcf` download). This React app is responsible for everything a logged-in user does:

```text
1. SaaS Dashboard
        |
        +── Cards
        +── Builder
        +── Analytics
        +── Team
        +── Billing
        +── Orders
        +── Settings
```

It also implements the **live preview** of the public card inside the builder (a React re-implementation of the same template/theme rendering rules the backend uses for the real public page — see §11), and optionally the marketing site pages if they are not handled by Django templates.

## 2. Technology Stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit / RTK Query
- Tailwind CSS
- shadcn/ui
- Recharts
- React Hook Form
- Zod
- A drag-and-drop library for the card builder

## 3. Frontend Project Structure

```text
src/
│
├── app/
│   ├── store.ts
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   ├── cards/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── cards/
│   ├── builder/
│   ├── analytics/
│   ├── team/
│   ├── billing/
│   ├── directory/
│   ├── appointments/
│   └── orders/
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── cards/
│   ├── billing/
│   ├── team/
│   └── settings/
│
├── services/
│   ├── api.ts          # RTK Query base, /api/v1/ baseURL, auth header injection
│   ├── auth.ts
│   └── uploads.ts
│
├── hooks/
├── lib/
├── types/
└── assets/
```

## 4. Dashboard Application — Sections

Dashboard, My Cards, Create Card, Card Builder, Analytics, Enquiries, Appointments, Team, Directory (management view), Orders, Billing, Templates, Settings.

## 5. Dashboard Layout

```text
┌───────────────────────────────────────────────┐
│ Logo                         Notifications User│
├─────────────┬─────────────────────────────────┤
│             │                                 │
│ Dashboard   │                                 │
│ Cards       │          Main Content           │
│ Analytics   │                                 │
│ Enquiries   │                                 │
│ Team        │                                 │
│ Billing     │                                 │
│ Orders      │                                 │
│ Settings    │                                 │
│             │                                 │
└─────────────┴─────────────────────────────────┘
```

Responsive mobile navigation is required (collapsible sidebar / bottom nav on small screens).

## 6. Card Builder

Users should be able to: add block, remove block, duplicate block, reorder block, hide/show block, edit block, preview block.

Default block order (drag-and-drop reorderable): Profile → Bio → Social Links → Services → Products → Gallery → Testimonials → Appointments → Custom Links.

Block types map 1:1 to the backend `ProfileBlock.type` enum: `social`, `link`, `service`, `product`, `testimonial`, `gallery`, `video`, `contact`, `location`, `appointment`, `custom`.

Changes should autosave (debounced PATCH to `/api/v1/blocks/{id}/`, with optimistic UI updates via RTK Query).

## 7. Live Preview

The live preview is a React component tree that mirrors the backend's public-page rendering rules (same template layouts, same `theme_config` JSON schema — see backend §23–24) so what the user sees in the builder matches the real public page pixel-for-pixel. Treat this as a shared "template renderer" module that only reads `template` + `theme_config` + block data as props — no builder-only state leaks into it, so it can eventually be extracted or compared 1:1 against the Django-rendered output.

Desktop:

```text
Builder                         Preview

Blocks                         ┌──────────────┐
                               │              │
Profile                        │   CARD       │
Social                         │   PREVIEW    │
Services                       │              │
Gallery                        │              │
                               └──────────────┘
```

Mobile preview:

```text
┌───────────────┐
│               │
│   VCard       │
│   Preview     │
│               │
└───────────────┘
```

## 8. Authentication (Frontend Flows)

Screens/flows: register, login, logout, forgot password, reset password, email verification, session refresh (silent token refresh via RTK Query base query), "me" fetch on app load to hydrate the auth store.

Consumes:

```text
POST /api/v1/auth/register/
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
POST /api/v1/auth/forgot-password/
POST /api/v1/auth/reset-password/
GET  /api/v1/auth/me/
```

Optional later: Google / Apple / Microsoft OAuth buttons.

Store JWT access token in memory (Redux state), refresh token in an httpOnly cookie if the backend supports it — never persist the access token to `localStorage`.

## 9. Cards Feature — API Consumption

```text
GET    /api/v1/vcards/
POST   /api/v1/vcards/
GET    /api/v1/vcards/{id}/
PATCH  /api/v1/vcards/{id}/
DELETE /api/v1/vcards/{id}/

POST   /api/v1/vcards/{id}/publish/
POST   /api/v1/vcards/{id}/unpublish/

GET    /api/v1/vcards/{id}/qr/
GET    /api/v1/vcards/{id}/contact/

GET    /api/v1/vcards/{id}/blocks/
POST   /api/v1/vcards/{id}/blocks/
PATCH  /api/v1/blocks/{id}/
DELETE /api/v1/blocks/{id}/
POST   /api/v1/vcards/{id}/blocks/reorder/
```

The card list, card editor, and live preview (§7) are all built on top of these endpoints. QR download in the dashboard just links to/embeds the `GET .../qr/` response (PNG/SVG/PDF per backend §20) — no client-side QR generation.

## 10. Templates & Theme Selection UI

```text
GET /api/v1/templates/
```

Render a template gallery (grid of `preview_image` + name + `is_premium` badge). Selecting a template sets `VCard.template`; theme customization (colors, fonts, button/card style, border radius — see backend §24 JSON schema) is a form (color pickers, font select, style toggles) that PATCHes `theme_config` on the VCard and re-renders the live preview (§7) immediately, debounced before autosave.

Gate premium templates/themes behind the subscription entitlement check (§14) — grey out with an upgrade prompt rather than hiding entirely.

## 11. Public Card UX Reference

The builder's live preview (§7) should visually match this target layout, which is what Django renders at `GET /@<slug>`:

```text
┌───────────────────────────────┐
│          Cover Image          │
│          Profile Photo        │
│          John Doe             │
│       Software Engineer       │
│         ABC Technologies      │
│       [ Save Contact ]        │
│  [ WhatsApp ] [ Email ]       │
│       About Me / Bio          │
│       Services                │
│       Social Links            │
│       Products                │
│       Gallery                 │
│       Testimonials            │
│       Book Appointment        │
│       Contact Me              │
└───────────────────────────────┘
```

## 12. Card Actions & Sharing (Dashboard Controls)

Primary actions surfaced in the dashboard for a published card: Save Contact (links to the `.vcf` endpoint), Call, Email, WhatsApp, Visit Website, Share, Book Appointment, Send Enquiry (these last few are for preview/testing — the actual visitor-facing versions run on the Django public page).

Share panel: copy link, WhatsApp, Facebook, LinkedIn, X, Email, native mobile share (`navigator.share` with fallback).

Every VCard has a canonical URL surfaced in the dashboard, e.g. `https://domain.com/@john-doe`, with a copy-to-clipboard control.

## 13. Analytics Dashboard (Frontend)

Consumes `/api/v1/analytics/...` (backend §26 contract). Display: Total Views, Unique Visitors, Link Clicks, Contact Downloads, Enquiries, Appointments, Top Links, Traffic Sources, Countries, Devices.

Charts (Recharts): views over time, clicks over time, engagement rate, traffic sources (pie/bar), device distribution.

Time filters: Today, 7 days, 30 days, 90 days, 12 months, Custom (date range picker).

Never render or request raw IP data — the backend never sends it.

## 14. Team Management (Frontend)

```text
GET    /api/v1/organizations/
GET    /api/v1/organizations/{id}/
PATCH  /api/v1/organizations/{id}/

GET    /api/v1/organizations/{id}/members/
POST   /api/v1/organizations/{id}/members/invite/
PATCH  /api/v1/organizations/{id}/members/{member}/
DELETE /api/v1/organizations/{id}/members/{member}/

POST /api/v1/vcards/{id}/assign/
POST /api/v1/vcards/{id}/unassign/
```

UI: member list with role badges (owner/admin/member), invite-by-email form, role change dropdown (permission-gated — only owner/admin see it), card assignment picker on each VCard's settings.

Enforce role-based UI hiding as a UX convenience only — the backend is the real authority (backend §5, §41).

## 15. Billing (Frontend)

```text
GET  /api/v1/billing/plans/
GET  /api/v1/billing/subscription/
POST /api/v1/billing/checkout/
POST /api/v1/billing/cancel/
POST /api/v1/billing/reactivate/
GET  /api/v1/billing/invoices/
```

UI: pricing/plan comparison table (driven entirely by `GET plans/` — never hardcode plan names, prices, or limits in the frontend, per backend §27), current subscription status card (trial countdown, renewal date, cancel-at-period-end notice), checkout flow branching by provider (Stripe Checkout redirect/embed vs. M-Pesa/SasaPay phone-number + STK-push prompt flow), invoice/payment history table.

Feature gating in the UI (disabled buttons, upgrade prompts, usage bars for `max_vcards`/`max_storage_mb`/etc.) should read from the subscription object returned by `GET subscription/` — treat it as display-only; the backend enforces the real limits (backend §29).

## 16. Orders (Frontend — Physical NFC Cards)

UI for browsing `PhysicalCardProduct` options (material: PET Plastic / Wood / Metal), cart/checkout for ordering physical cards, shipping address form, order status tracking (`pending_payment → paid → processing → printing → shipped → delivered`), and linking an ordered NFC card to a specific VCard once delivered.

## 17. Directory (Management View)

Authenticated management endpoints only (`/api/v1/directory/...`): toggle `is_directory_visible` on a card, set directory category/industry/location fields. The actual public `/directory` search page is server-rendered by Django (backend §35–37) — this app only manages *whether and how* a card appears there, not the public listing itself.

## 18. Enquiries & Appointments (Frontend Management)

**Enquiries** inbox: list with status filters (`new/read/replied/archived`), mark-as-read, reply action (opens mail client or in-app reply form depending on scope).

**Appointments**: availability rule editor (weekday + time range + timezone, per `AvailabilityRule`), service list with duration/price, bookings calendar/list view with status transitions (`pending → confirmed/cancelled → completed/no_show`).

## 19. Settings

Profile settings (name, email, phone, avatar, password change), organization settings (name, logo, contact info — owner/admin only), notification preferences, custom domain configuration (Phase 2/3 placeholder, see backend §62).

## 20. Visual Design Language (Reference: digitalbusinesscard.com)

The marketing site and dashboard should follow a clean, confident, minimal-but-premium design direction — closer to a modern SaaS/consumer app than a dense B2B admin panel. Reference: digitalbusinesscard.com.

**Overall feel**
- Generous whitespace, large type, short punchy headline copy broken into two-line statements rather than long paragraphs
- High-contrast, mostly neutral palette (near-black text on white/off-white, black CTA buttons) with a single accent color reserved for interactive/brand moments — not a busy multi-color UI
- Rounded corners throughout (cards, buttons, inputs) rather than sharp edges
- Motion used deliberately: short looping product-demo clips/animations in hero and feature sections rather than static screenshots, subtle scroll-triggered reveals — not gratuitous animation everywhere
- Photography/UI mockups shown at an angle or in a phone-frame, not flat screenshots

**Marketing page structure to emulate**
1. Sticky top nav: logo, a couple of top-level links (Personal/Teams-style toggle), Log in, a solid dark "Get started" CTA button
2. Hero: social-proof badge/rating line above a short two-line headline, single primary CTA, hero visual (product in a phone frame)
3. Logo strip: "Trusted by" row, small and unobtrusive
4. Alternating feature sections: short headline + 1–2 sentence description + supporting visual, alternating text/media sides down the page
5. Animated stat counters (users, countries, rating) as their own band
6. "How it works" as a numbered 2–3 step sequence with supporting visuals
7. Analytics/feature deep-dive section with a single strong visual
8. Persona/use-case grid: a scrollable row of pill/chip links ("Realtor", "Photographer", "Freelancer" etc.) — useful pattern for this rebuild's directory categories too
9. Testimonial carousel: avatar, name, role/company, short quote
10. Closing CTA band with a fanned/grid arrangement of template previews
11. FAQ as a grouped accordion (categories like Getting Started, Customization, Sharing) with a supporting quote/image beside it
12. Footer: logo, link columns (General/Legal/Contacts), social icons, legal line

**Apply this to the app as follows**
- Marketing pages (§21): follow this structure directly if built in React — hero, alternating features, stats band, testimonials, FAQ accordion, footer
- Card templates & theme engine (§10): the "premium, minimal, high-contrast, rounded, lots of whitespace" aesthetic is a good default template/theme, not just a marketing-page style — bias the initial template set (backend §23) toward this look before adding busier/decorative templates
- Dashboard (§4–§5): keep the same restraint — neutral palette, one accent color for primary actions, generous spacing, avoid dense data-grid defaults where a card/list layout reads more clearly
- Persona chip row pattern (item 8 above) maps well onto category browsing in the directory management view (§17) and onto industry/business-type selection during card creation

Treat this as an aesthetic reference, not a literal clone — do not reproduce this site's copy, illustrations, or exact layout pixel-for-pixel; build an original visual system in the same spirit.

## 21. Marketing Site Pages (If Built in React)

If not handled by Django templates: `/`, `/features`, `/templates`, `/pricing`, `/about`, `/contact`, `/faq`. CTAs: "Create your card", "Get started", "View templates". The `/directory` and `/@<slug>` public pages are explicitly **out of scope** for this app regardless (backend §22, §35).

## 22. Frontend Testing Strategy

Test: authentication flow, card creation, builder interactions (add/remove/reorder/duplicate blocks), drag-and-drop, publish/unpublish flow, analytics rendering, billing/checkout flow, team management (invite/role change/assign), responsive layouts at mobile/tablet/desktop breakpoints.

## 23. Frontend CI Pipeline

```text
Push → Install dependencies → Lint → Type check → Frontend build → Deploy
```

Type-check (`tsc --noEmit`) and lint must pass before build; build must produce a static bundle deployable behind the CDN in front of the dashboard (backend §56 deployment diagram).

## 24. Frontend Build Order (Maps to Backend Phases)

```text
STEP 01  Project scaffold — Vite + React + TS + Tailwind + shadcn/ui + RTK Query
STEP 02  Auth screens + token/session handling
STEP 03  Card list + create/edit forms (single template, backend Phase 1)
STEP 04  Live preview renderer (§7) for the one MVP template
STEP 05  QR download UI + Save Contact link
STEP 06  Template gallery + theme editor (backend Phase 2)
STEP 07  Card builder — blocks: services, products, gallery, testimonials, links
STEP 08  Enquiries inbox
STEP 09  Analytics dashboard + charts (backend Phase 3)
STEP 10  Appointments UI
STEP 11  Billing UI + checkout flows (backend Phase 4)
STEP 12  Team management + card assignment (backend Phase 5)
STEP 13  Directory management view (backend Phase 6)
STEP 14  Orders / physical card flow (backend Phase 7)
STEP 15  Settings, custom domain placeholder, polish (backend Phase 8)
```

## 25. Core Principle

The frontend is a thin, data-driven client over the backend's `VCard → ContentBlocks → Template → Theme` model (backend §64) — it should never encode business rules (plan limits, role permissions, pricing) that the backend already owns. Every gate, limit, and price shown in the UI is read from the API, not hardcoded, so the two apps never drift out of sync.