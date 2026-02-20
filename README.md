# Coding Progress + AI Mentor

A Day-1-ready foundation for building a **Coding Progress + AI Mentor** web app with Next.js, TypeScript, Tailwind, and Supabase.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + database)

## Implemented now
- App Router + TypeScript + Tailwind setup
- Linting and env template
- Base UI shell: sidebar, topbar, theme-toggle placeholder
- Route protection placeholder middleware for `/dashboard`, `/problems`, `/mentor`
- Supabase client/server helper stubs
- 14-day execution roadmap in `docs/ROADMAP.md`

## Quick Start
```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment Variables
Copy and fill:

```bash
cp .env.example .env.local
```

Required values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Suggested next step
Follow Day 2 in the roadmap: wire Supabase auth and replace middleware placeholder with real session checks.
