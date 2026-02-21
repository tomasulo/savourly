# Savourly — Agent Conventions

> This file is the single source of truth for all AI agents working on this repo.
> Read it fully before starting any task.

## Project Overview
Personal recipe tracker with authentication and Vercel deployment.
This repo is **100% AI-developed** — all coding is done by AI agents. Optimize for clarity, consistency, and agent-parseable structure.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (in `src/components/ui/`)
- **Database:** Turso/LibSQL (local file or hosted)
- **Authentication:** BetterAuth (email/password)
- **i18n:** next-intl (EN + DE, messages in `src/messages/`)
- **Package manager:** npm

## Commands
```bash
npm run dev           # Start dev server on http://localhost:3000
npm run build         # Production build — MUST pass before opening a PR
npm run lint          # ESLint check
npm run start         # Start production server
npm run test          # Run unit tests (watch mode)
npm run test:ui       # Run unit tests with UI
npm run test:coverage # Run unit tests with coverage report
npm run test:e2e      # Run E2E tests with Playwright
npm run test:e2e:ui   # Run E2E tests with Playwright UI
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
Components install to `src/components/ui/`. Available: button, card, input, badge, select, textarea, label. Add more as needed.

## Project Structure
```
savourly/
├── src/
│   ├── app/              # App Router pages & layouts
│   │   ├── api/auth/     # BetterAuth API route ([...all]/route.ts)
│   │   └── [locale]/     # i18n-aware routes (EN + DE)
│   │       ├── layout.tsx
│   │       ├── page.tsx  # Landing page
│   │       ├── login/    # Login page
│   │       ├── register/ # Registration page
│   │       └── recipes/
│   │           ├── page.tsx        # Recipe list
│   │           ├── new/            # Recipe creation (page, form, actions)
│   │           ├── [id]/           # Recipe detail, edit, server actions
│   │           └── discover/       # Recipe discovery page
│   ├── components/       # Shared UI components
│   │   ├── navigation.tsx          # Top nav with auth state
│   │   ├── recipe-card.tsx         # Recipe card with image, badges
│   │   ├── bookmark-button.tsx     # Bookmark toggle (authenticated)
│   │   ├── language-switcher.tsx   # EN/DE switcher
│   │   └── ui/           # shadcn/ui primitives (DO NOT edit these manually)
│   ├── db/               # SQLite schema, connection, queries
│   │   ├── index.ts      # DB connection singleton (getDb())
│   │   ├── schema.ts     # CREATE TABLE statements (recipes + BetterAuth tables)
│   │   ├── seed.ts       # Sample recipes for development
│   │   └── queries.ts    # Query functions (getRecipeWithDetails, getCookingLogs)
│   ├── lib/              # Utilities, types & auth
│   │   ├── auth.ts       # BetterAuth server config
│   │   ├── auth-client.ts # Client hooks (useSession, signIn, signUp, signOut)
│   │   ├── auth-helpers.ts # Server helpers (getSession, requireAuth)
│   │   ├── utils.ts      # cn() utility from shadcn
│   │   └── types.ts      # Recipe, Ingredient, Instruction, CookingLog, RecipeWithDetails
│   ├── messages/         # i18n JSON files
│   │   ├── en.json       # English
│   │   └── de.json       # German
│   └── test/             # Test files
│       ├── setup.ts      # Vitest setup (jest-dom, cleanup)
│       └── e2e/          # Playwright E2E tests
├── CLAUDE.md             # This file — agent conventions
├── README.md             # Project overview
├── .env.example          # Environment variable template
├── vitest.config.ts      # Vitest configuration
├── playwright.config.ts  # Playwright configuration
├── .claude/
│   └── settings.json     # Permissions for AI agents (git, gh, npm, npx allowed)
└── .github/
    └── ISSUE_TEMPLATE/   # Issue templates for features & bugs
```

## Git Conventions
- **Branch naming:** `issue-<number>-<short-description>` (e.g., `issue-1-sqlite-schema`)
- **Commits:** Conventional commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **PRs:** Always run `npm run build` before opening a PR. PR title matches the issue title
- **Never push directly to `main`** — always use feature branches + PRs
- **Git identity (repo-local):** email `917136+tomasulo@users.noreply.github.com`, name `Thomas`

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

## Testing Requirements

**CRITICAL: All new code MUST include automated tests.**

### Test Stack
- **Unit/Component Tests:** Vitest + React Testing Library + @testing-library/jest-dom
- **E2E Tests:** Playwright
- **Coverage:** v8 provider with text/json/html reporters

### When to Write Tests
Write tests for **every new feature or component**:
1. **Unit tests** for components — rendering, user interactions, edge cases
2. **Unit tests** for utilities — all code paths and error handling
3. **E2E tests** for user flows — happy paths and critical journeys

### Test File Conventions
- **Component tests:** Colocate with components (e.g., `recipe-card.test.tsx` next to `recipe-card.tsx`)
- **E2E tests:** Place in `src/test/e2e/` (e.g., `recipe-creation.spec.ts`)
- **Test naming:** Use `*.test.tsx` for unit tests, `*.spec.ts` for E2E tests
- **Vitest excludes:** E2E tests are excluded from Vitest (they run via Playwright)

### Test Structure
```typescript
// Unit test example
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './my-component'

// Mock next-intl, next/image, i18n routing as needed
vi.mock('next-intl', () => ({ ... }))

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

```typescript
// E2E test example
import { test, expect } from '@playwright/test'

test.describe('Feature Flow', () => {
  test('should complete user journey', async ({ page }) => {
    await page.goto('/en/feature')
    // ... test steps
  })
})
```

### Running Tests
- Run `npm run test` before committing to ensure all unit tests pass
- Run `npm run build` before opening PR (includes TypeScript check)
- E2E tests are optional during development but recommended for critical flows
- QA agent will verify all tests pass during PR review

### Test Coverage Goals
- Aim for meaningful coverage, not 100% coverage
- Focus on testing behavior and user-facing functionality
- Test edge cases: null/undefined values, empty states, error conditions
- Skip trivial getters/setters

## Database
- Turso/LibSQL (SQLite-compatible)
- DB file: `savourly.db` at project root for local development (gitignored)
- Schema managed in `src/db/schema.ts` — use `CREATE TABLE IF NOT EXISTS`
- Includes BetterAuth tables (user, session, account, verification)
- Seed data in `src/db/seed.ts` — called automatically from `getDb()`
- Connection singleton in `src/db/index.ts`
- Query functions in `src/db/queries.ts`
- Use prepared statements for all queries (prevents SQL injection)
- Recipes are associated with authenticated users via `user_id` column

## Authentication
- BetterAuth with email/password only
- Server config: `src/lib/auth.ts`
- Client hooks: `src/lib/auth-client.ts` (useSession, signIn, signUp, signOut)
- Helper functions: `src/lib/auth-helpers.ts` (getSession, requireAuth)
- API route: `src/app/api/auth/[...all]/route.ts`
- Auth pages: `/login` and `/register`
- Protected routes: `/recipes/new` and `/recipes/[id]/edit` require authentication
- Public routes: landing page, recipe list, and recipe detail remain accessible to all

## Agent Efficiency Rules

**CRITICAL: Follow these rules to minimize token waste and maximize shipping speed.**

1. **Never create documentation files** (*.md) unless the issue explicitly requests it. No implementation summaries, testing guides, or changelogs.
2. **Build early, build often.** Run `npm run build` after core changes — don't wait until the end. This catches type errors before you've written 500 more lines.
3. **Run tests early.** Run `npm run test -- --run` after modifying existing test files or adding new ones. Fix failures immediately.
4. **Ship before perfection.** Commit, push, and create the PR before running out of turns. A PR with minor issues is better than uncommitted code.
5. **Don't read files you don't need.** Only read files directly relevant to your changes. Don't explore "just in case."
6. **Don't write unused code.** No wrapper components, helper files, or abstractions you don't immediately use. Delete dead code.
7. **Keep vi.mock calls correct.** When using `vi.mock` with variables, use `vi.hoisted()` to avoid hoisting issues. This is a common Vitest pitfall.
8. **Prioritize this order:** code → build → test → fix → commit → push → PR. Never reorder.

## Development Workflow

### Single-Agent Workflow (Cost-Optimized)
Sonnet implements issues. PM (Opus) orchestrates, reviews, and merges. Sonnet does NOT merge.

```
For each issue:
1. Read issue from GitHub: gh issue view <N>
2. Read only the files you need to modify
3. Create branch: git checkout -b issue-<N>-<slug> main
4. Implement the feature
5. Run: npm run build — must pass with zero errors
6. Run: npm run test -- --run — fix any failures
7. Commit (conventional commits), push, create PR via gh
8. Do NOT merge — PM reviews and merges
```

## Deployment
- **Platform:** Vercel
- **Database:** Turso hosted (libsql://...) — configure via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
- **Auth secret:** Generate with `openssl rand -base64 32`, set as `BETTER_AUTH_SECRET`
- **Auth URL:** Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to the Vercel domain
