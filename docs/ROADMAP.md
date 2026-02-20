# Coding Progress + AI Mentor — 14-Day Execution Roadmap

## Day 1 — Project Setup
- Initialize Next.js app (App Router + TypeScript + Tailwind).
- Setup linting, formatting, env structure.
- Add UI foundation (layout, sidebar, topbar, theme toggle placeholder).
- Create GitHub repo + initial deploy on Vercel.

## Day 2 — Auth + Database Setup
- Create Supabase project.
- Configure Auth (email/password, optionally Google).
- Setup client/server Supabase helpers.
- Protect routes (`/dashboard`, `/problems`, `/mentor`).

## Day 3 — Database Schema
- Create core tables:
  - `profiles`
  - `problems`
  - `daily_activity`
  - `xp_log`
  - `ai_sessions`
- Add indexes and timestamps.
- Add Row-Level Security policies (user can only access own data).

## Day 4 — Problem Tracker CRUD (Part 1)
- Build “Add Problem” form with URL, title, difficulty, pattern, notes.
- Implement platform auto-detect from URL (LeetCode/GFG/Codeforces).
- Save to DB with `status` default = `unsolved`.

## Day 5 — Problem Tracker CRUD (Part 2)
- Problems list with filters: platform, status, difficulty, pattern.
- Implement mark solved/unsolved toggle.
- Add edit + delete actions.

## Day 6 — Dashboard Analytics
- Build stats cards: total solved, unsolved, streak, XP.
- Add charts:
  - solved by difficulty
  - solved by pattern
  - last 7 days activity

## Day 7 — Streak Engine
- Implement daily streak continuity logic.
- Reset streak on break.
- Persist streak metadata.
- Add streak widget + “🔥 current streak”.

## Day 8 — Calendar + Activity Heatmap
- Build monthly heatmap (GitHub-style).
- Show solved count per day.
- Tooltip with details per date.

## Day 9 — XP + Level System
- Define XP rules: Easy +10, Medium +20, Hard +35.
- Add streak bonus multiplier.
- Log XP events in `xp_log`.
- Add level progression bar.

## Day 10 — AI Mentor Backend
- Add `/api/ai/hint` endpoint.
- Prompt templates for hint-only, approach, complexity.
- Add rate limiting + daily usage cap.

## Day 11 — AI Mentor UI
- Add “Get Hint” in problem detail page.
- Show response tabs: Hint, Approach, Time/Space Complexity.
- Add “Reveal full solution” as secondary action.

## Day 12 — Polish UI/UX
- Implement dark/light mode fully.
- Apply glassmorphism style consistently.
- Improve responsive layout.
- Add loading skeletons + empty states + toasts.

## Day 13 — Testing + Stability
- Validate flows: auth, problem CRUD, streak updates, AI responses.
- Add error boundaries and API error handling.
- Tighten type safety.

## Day 14 — Launch + Portfolio Prep
- Final deploy on Vercel.
- Configure custom domain (optional).
- Write README with features, architecture, screenshots, setup.
- Record a short demo video.
