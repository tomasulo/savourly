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
│   │   └── recipes/
│   │       ├── new/      # Recipe creation (page, form, actions)
│   │       └── [id]/     # Recipe detail (page, recipe-detail component)
│   ├── components/       # Shared UI components
│   │   └── ui/           # shadcn/ui primitives (DO NOT edit these manually)
│   ├── db/               # SQLite schema, connection, queries
│   │   ├── index.ts      # DB connection singleton (getDb())
│   │   ├── schema.ts     # CREATE TABLE statements
│   │   ├── seed.ts       # 6 sample recipes for development
│   │   └── queries.ts    # Query functions (getRecipeWithDetails, getCookingLogs)
│   ├── lib/              # Utilities & shared types
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
- SQLite via better-sqlite3
- DB file: `savourly.db` at project root (gitignored)
- Schema managed in `src/db/schema.ts` — use `CREATE TABLE IF NOT EXISTS`
- Seed data in `src/db/seed.ts` — called automatically from `getDb()`
- Connection singleton in `src/db/index.ts`
- Query functions in `src/db/queries.ts`
- Use prepared statements for all queries (prevents SQL injection)
- Keep the DB schema ready for future multi-user support (include a `user_id` column where appropriate, default to 1 for now)

## Development Workflow

### Single-Agent Workflow (Cost-Optimized)
The main session (Sonnet) handles BOTH orchestration AND coding. Only spawn a Haiku subagent for QA reviews.

```
For each issue:
1. Read issue from GitHub: gh issue view <N>
2. Create branch: git checkout -b issue-<N>-<slug> main
3. Implement the feature (write files, install components if needed)
4. Run: npm run build — must pass with zero errors
5. Commit (conventional commits), push, create PR via gh
6. Spawn Haiku QA subagent to review the PR
7. Fix any QA findings, push again
8. Merge PR: gh pr merge <N> --squash --delete-branch
9. Update main: git checkout main && git pull
10. Move to next issue
```

### QA Agent (Haiku Subagent)
Spawn with `model: haiku`, `subagent_type: general-purpose`. Give it:
- The PR number and repo name
- Instruction to read all changed files
- Instruction to run `npm run build`
- Instruction to post review as `gh pr comment`
- The issue acceptance criteria

### Sprint Retro
After completing all 5 issues in a sprint, do a brief retro:
- What worked well?
- What slowed things down?
- What to improve for next sprint?

## Future Plans
- **Authentication:** Planned (likely NextAuth.js or similar). NOT implemented yet. Keep codebase auth-ready: include `user_id` columns, but don't add auth middleware/providers
- **Deployment:** Planned (likely Vercel). NOT implemented yet. No deploy-specific config needed now
- Do NOT add auth or deployment code until explicitly requested
