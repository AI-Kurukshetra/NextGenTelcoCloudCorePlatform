# NGCMCP Control Plane

Cloud-native 5G/4G mobile core control platform built with Next.js App Router and Supabase.

## Implemented Scope

This repo is scaffolded from `NGCMCP_Codex_Complete_Build_Guide.md` and includes:

- Public marketing/auth routes from the guide
- Protected `/app/*` module routes (dashboard, NF, slices, subscribers, sessions, policies, billing, monitoring, security, compliance, orchestration, edge, AI, marketplace, topology, configurations, admin, settings)
- Complete API route surface via `/app/api/[...path]/route.ts` dispatcher
- Supabase schema migration with tenant-aware tables, RLS, and seed data
- Auth flows (signup, login, logout, session, reset) + API key management
- Realtime hook scaffolding for alarms/NF/session updates
- Helm chart scaffolding for NF orchestration (`k8s/helm`)

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Tailwind CSS 4

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create environment file

```bash
cp .env.example .env.local
```

Fill Supabase values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Apply database schema and seed

**Option A – Migrate via script (recommended):**

```bash
# Set DATABASE_URL and optionally DIRECT_DATABASE_URL in .env (see .env.example)
npm run db:migrate
```

If migrations fail due to network or pooler limits, use Option B.

**Option B – Via Supabase Dashboard:**

- Open your project → SQL Editor
- Run each file in `supabase/migrations/` in order
- Run `supabase/seed.sql`

4. Create demo users (optional)

```bash
npm run db:seed-demo-users
# Login: super_admin@demo.ngcmcp.com (or any demo user), password: DemoPass123
```

5. Start dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Coverage

All endpoints listed in the build guide are supported under one dispatcher:

- `/api/auth/*`
- `/api/subscribers/*`
- `/api/network-functions/*`
- `/api/slices/*`
- `/api/sessions/*`
- `/api/policies/*`
- `/api/billing/*`
- `/api/monitoring/*`
- `/api/faults/*`
- `/api/orchestration/*`
- `/api/security/*`
- `/api/ai/*`
- `/api/marketplace/*`
- `/api/compliance/*`
- `/api/admin/*`

## Notes

- GitHub Actions / Vercel deployment are intentionally deferred.
- Database implementation is complete in Supabase SQL and connected to all API modules.
- Some advanced behaviors (Kafka broker connectivity, full SAML/SSO provider wiring, and production-grade AI inference) are scaffolded and ready for provider integration.
