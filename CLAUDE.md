# Savourly — Agent Conventions

> This file is the single source of truth for all AI agents working on this repo.
> Read it fully before starting any task.

## Project Overview
Personal recipe tracker. Local-first (auth & deployment planned for later).
This repo is **100% AI-developed** — all coding is done by AI agents. Optimize for clarity, consistency, and agent-parseable structure.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (in `src/components/ui/`)
- **Database:** better-sqlite3 (file: `savourly.db` at project root)
- **i18n:** next-intl (EN + DE, messages in `src/messages/`)
- **Package manager:** npm

## Commands
```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build — MUST pass before opening a PR
npm run lint      # ESLint check
npm run start     # Start production server
```

## Design System

### Principles
1. **Meaningful minimalism** — every element earns its place
2. **Food photography first** — large, prominent images drive engagement
3. **One-handed friendly** — thumb-reachable actions
4. **Scannable** — visual hierarchy through size/spacing, not clutter

### Visual Language
- **Layout:** Card-based with generous whitespace. Bento-grid-inspired homepage
- **Colors:** Warm neutral base (off-white/cream `--background`), terracotta accent (`--primary`), dark text. Dark mode supported via `.dark` class. All colors defined as CSS variables in `src/app/globals.css` using oklch
- **Typography:** Geist (loaded via `next/font`). Size-based hierarchy — large titles, medium subtitles, comfortable body text
- **Cards:** Large recipe cards with prominent imagery, title + cook time badge + difficulty indicator
- **Spacing:** Generous padding and margins. Content breathes. Use Tailwind spacing scale (p-4, p-6, gap-4, gap-6, etc.)
- **Border radius:** Uses `--radius` variable (0.75rem base). Apply via shadcn classes: `rounded-lg`, `rounded-xl`

### Key UX Patterns
- **Recipe list:** Card grid with large images, title, cook time badge, difficulty indicator
- **Recipe detail:** Hero image, quick facts bar (time, servings, difficulty), collapsible ingredients with checkboxes, numbered step-by-step instructions
- **Search:** Predictive search bar at top, filter chips (cuisine, time, difficulty, dietary)
- **Cooking mode:** Step-by-step view with large text, swipe between steps, timer integration
- **Serving adjuster:** +/- control that scales ingredient quantities
- **Unit toggle:** Metric/imperial switch for ingredients
- **Cooking log:** Timeline-style entries under each recipe with date, notes, optional rating
- **Navigation:** Clean top nav with logo, search, language switcher

### Adding New shadcn/ui Components
```bash
npx shadcn@latest add <component-name>
```
Components install to `src/components/ui/`. Available base components: button, card, input, badge. Add more as needed.

## Project Structure
```
savourly/
├── src/
│   ├── app/              # App Router pages & layouts
│   ├── components/       # Shared UI components
│   │   └── ui/           # shadcn/ui primitives (DO NOT edit these manually)
│   ├── db/               # SQLite schema, connection, queries
│   │   ├── index.ts      # DB connection singleton
│   │   ├── schema.ts     # CREATE TABLE statements & migrations
│   │   └── seed.ts       # Seed data for development
│   ├── lib/              # Utilities & shared types
│   │   ├── utils.ts      # cn() utility from shadcn
│   │   └── types.ts      # Shared TypeScript interfaces/types
│   └── messages/         # i18n JSON files
│       ├── en.json       # English
│       └── de.json       # German
├── CLAUDE.md             # This file — agent conventions
├── README.md             # Project overview
└── .github/
    └── ISSUE_TEMPLATE/   # Issue templates for features & bugs
```

## Git Conventions
- **Branch naming:** `issue-<number>-<short-description>` (e.g., `issue-1-sqlite-schema`)
- **Commits:** Conventional commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **PRs:** Always run `npm run build` before opening a PR. PR title matches the issue title
- **Never push directly to `main`** — always use feature branches + PRs

## Code Conventions
- Functional components only (no class components)
- Server Components by default; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- Server Actions for data mutations (forms, data writes)
- Use `@/` import alias for all project imports (e.g., `import { Button } from "@/components/ui/button"`)
- Colocate types with their usage; shared types in `src/lib/types.ts`
- Name files in **kebab-case** (`recipe-card.tsx`), components in **PascalCase** (`RecipeCard`)
- Use shadcn/ui primitives as base; customize via Tailwind classes to match Savourly's warm aesthetic
- Keep components focused — one component per file
- Prefer composition over complex prop APIs
- All user-facing strings must use next-intl translations (never hardcode text)

## Database
- SQLite via better-sqlite3
- DB file: `savourly.db` at project root (gitignored)
- Schema managed in `src/db/schema.ts` — use `CREATE TABLE IF NOT EXISTS`
- Seed data in `src/db/seed.ts`
- Connection singleton in `src/db/index.ts`
- Use prepared statements for all queries (prevents SQL injection)
- Keep the DB schema ready for future multi-user support (include a `user_id` column where appropriate, default to 1 for now)

## Agent Workflow
```
PM creates issue → Coding Agent implements → PR created
    → QA Agent reviews → Approved → PM merges
                       → Changes requested → Coding Agent fixes → re-review
```

### Coding Agent Checklist
1. Read this file and the issue description fully
2. Create branch: `issue-<N>-<slug>` from `main`
3. Implement the feature following all conventions above
4. Run `npm run build` — must pass with zero errors
5. Commit with conventional commit messages
6. Push branch and create PR with description referencing the issue
7. Wait for QA review

### QA Agent Checklist
1. Read the issue acceptance criteria
2. Review the PR diff for: correctness, code quality, design system compliance, a11y, security
3. Run `npm run build` to verify no build errors
4. Post review: approve or request specific changes

## Future Plans
- **Authentication:** Planned (likely NextAuth.js or similar). NOT implemented yet. Keep codebase auth-ready: include `user_id` columns, but don't add auth middleware/providers
- **Deployment:** Planned (likely Vercel). NOT implemented yet. No deploy-specific config needed now
- Do NOT add auth or deployment code until explicitly requested
