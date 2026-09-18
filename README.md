# DBC Frontend

The authenticated dashboard SPA for the Digital Business Card SaaS — cards, the
builder, analytics, billing, team management, orders, and settings. The public
card page, directory search, `.vcf` export, and QR image are server-rendered by
the Django backend and are out of scope here (see `forntend.md`).

## Stack

Vite + React 19 + TypeScript · Tailwind CSS v4 + shadcn/ui · Redux Toolkit +
RTK Query · React Router · React Hook Form + Zod · @dnd-kit · Recharts · Vitest
+ React Testing Library.

## Getting started

```bash
npm install
cp .env.example .env   # if present — otherwise set VITE_API_BASE_URL yourself
npm run dev
```

The dev server runs on **port 3000** (fixed in `vite.config.ts`) to match the
backend's default `CORS_ALLOWED_ORIGINS`. Run the Django backend separately
(`python manage.py runserver`, port 8000) alongside it.

### Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the backend API, including `/api/v1` (e.g. `http://127.0.0.1:8000/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID` | Reserved for a future Google OAuth login button (not wired up yet) |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then produce a production build in `dist/` |
| `npm run lint` | Run oxlint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run preview` | Preview the production build locally |

CI (`.github/workflows/frontend-ci.yml`) runs install → lint → type check →
test → build on every push/PR to `main`.

## Project structure

```text
src/
├── app/            # store, router, top-level providers
├── components/      # ui/ (shadcn primitives), layout/, forms/, charts/, cards/, builder/, billing/, common/
├── features/        # one folder per domain — RTK Query endpoints, slices, domain-specific hooks
├── pages/            # route-level page components, grouped by section
├── services/         # RTK Query base client, auth token storage, upload helpers
├── hooks/            # small cross-cutting hooks
├── lib/              # framework-free utilities (formatting, status/tone mapping, errors)
├── types/            # TypeScript types mirroring the backend's serializers
└── test/             # all *.test.ts(x) files (mirroring src/), plus render helpers + jsdom setup
```

Each `features/<domain>/` folder owns its slice of the API surface via
`baseApi.injectEndpoints` (see `services/api.ts` for the shared base query,
including silent JWT refresh). Pages import hooks from `features/`, not the
other way around.

## Notes for anyone picking this up

- The backend returns `access`/`refresh` tokens in the JSON body on login —
  there's no httpOnly-cookie flow. `access` lives in memory (Redux) only;
  `refresh` has to live in `localStorage` to survive a hard refresh (see
  `services/auth.ts` and `features/auth/AuthHydrator.tsx`).
- The live preview in the card builder (`components/cards/TemplateRenderer.tsx`)
  is the shared "renders the public page" component — it takes only
  `template` + `theme_config` + block/item data as props, on purpose, so it
  stays comparable to the real Django-rendered public page.
- Every plan limit, price, and feature flag shown in the UI is read from the
  API (`/billing/plans/`, `/billing/subscription/`) — nothing billing-related
  is hardcoded.
