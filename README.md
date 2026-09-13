# RepRank

An educational, from-scratch clone of the general idea behind [Liftoff](https://liftoffrank.com/)
("Ranked Gym Workouts"): a fitness tracker that ranks every exercise you log,
shows your progress as a curve over time, and lets you share nutrition
recipes with friends.

This project was built to learn/demonstrate the pattern, not to imitate
Liftoff's UI, branding, or proprietary ranking data — see
[Design notes](#design-notes) for how the ranking system was designed
independently.

## Features

- **Exercise library** — 51 seeded exercises across 12 muscle groups (chest,
  back, shoulders, biceps, triceps, forearms, core, quads, hamstrings,
  glutes, calves, traps), each with primary/secondary muscles worked,
  equipment, a difficulty level, and how-to instructions. Add your own
  custom exercises at any time.
- **Ranking system** — every exercise you log has its own tier (Wood →
  Bronze → Silver → Gold → Platinum → Diamond → Champion → Titan →
  Olympian) driven by "Lift Points" (LP). Hitting a personal record grants
  a big LP boost; consistent logging grants a smaller one. See
  [Design notes](#design-notes) for the exact formula.
- **Progress tracking** — every set is stored with its estimated one-rep max
  (Epley formula), so each exercise page renders a progress curve plus a
  full set history table with PRs flagged.
- **Profile & muscle breakdown** — an account-wide tier/level, and a
  per-muscle-group breakdown so you can see which muscles you train most
  and which are lagging.
- **Nutrition** — add recipes with macros (calories/protein/carbs/fat),
  ingredients, and instructions. Recipes can be private, shared with
  friends, or public.
- **Friends** — send/accept friend requests by username, compare overall
  tiers, and view a friend's muscle-group breakdown and top exercises.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- TypeScript + Tailwind CSS 4
- [Prisma](https://www.prisma.io/) + SQLite (zero external services needed)
- [Recharts](https://recharts.org/) for the progress curves
- Auth: bcrypt-hashed passwords + a signed JWT session cookie (`jose`), no
  third-party auth provider

## Getting started

```bash
npm install
cp .env.example .env   # then edit SESSION_SECRET to a long random string
npm run db:migrate     # creates prisma/dev.db and applies the schema
npm run db:seed        # seeds exercises, recipes, and two demo accounts
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Demo accounts created by the seed script (with several weeks of simulated
workout history, so the progress charts aren't empty on first login):

| Username     | Email               | Password      |
| ------------ | ------------------- | -------------- |
| `demo`       | demo@reprank.app     | `password123` |
| `alex_lifts` | alex@reprank.app     | `password123` |

They're already friends with each other, so you can try the friends/social
features immediately.

## Project structure

```
prisma/
  schema.prisma       Data model (SQLite)
  seed.ts              Seeds exercises, recipes, demo users + workout history
  exercise-data.ts      Static exercise library
  recipe-data.ts         Static recipe library
src/
  lib/
    ranking.ts          The tier/LP/XP algorithm (pure functions, see below)
    workout.ts           Transaction that logs a set + updates rank/XP
    auth.ts               Password hashing + session cookie helpers
    stats.ts               Overall + muscle-group stat aggregation
    constants.ts             Muscle groups / equipment / difficulty enums
    validation.ts             zod schemas for all forms
  actions/               Server Actions (the only way data is mutated)
  components/            Shared UI (forms, badges, chart, nav)
  app/                    Routes (dashboard, exercises, nutrition, friends, profile)
```

## Design notes

Liftoff's exact ranking formula is proprietary and compares your lifts
against its global user base — data this project has no access to. Rather
than fake that, `src/lib/ranking.ts` implements a small, transparent
formula tuned for a similar *feel*:

- **Estimated 1RM**: the Epley formula (`weight * (1 + reps/30)`) for
  weighted lifts. For unweighted bodyweight movements (weight = 0kg, e.g.
  strict pull-ups) there's no load to extrapolate from, so the rep count
  itself is the tracked score.
- **Lift Points (LP)**: the first time you log an exercise you get a flat
  15 LP baseline. Every new personal record grants LP scaled by the
  percentage improvement (10–100 LP). A non-PR set still grants a small
  "showed up" reward, capped at once per exercise per day, so LP tracks
  genuine progress rather than logging the same set on repeat.
- **Tiers**: 9 tiers (Wood → Olympian), 100 LP each, the same shape as
  Liftoff's rank ladder.
- **Overall account rank**: the simple average of your per-exercise LP
  totals. (Liftoff weights bigger lifts more heavily against its global
  leaderboard; this project keeps it simple and documents the
  simplification rather than guessing at undisclosed weights.)
- **Profile level**: a flat 100 XP per level from logging sets, completing
  sessions, and hitting PRs — separate from the per-exercise tier system.

## Scripts

| Command             | What it does                            |
| -------------------- | ---------------------------------------- |
| `npm run dev`         | Start the dev server (Turbopack)          |
| `npm run build`        | Production build + typecheck              |
| `npm run lint`          | ESLint                                      |
| `npm run db:migrate`     | Run/create Prisma migrations               |
| `npm run db:seed`         | Seed exercises, recipes, and demo accounts |
| `npm run db:studio`        | Open Prisma Studio to browse the database |
