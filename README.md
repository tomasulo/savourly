# Savourly

Personal recipe tracker built with Next.js, TypeScript, and SQLite. Fully AI-developed.

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (run before every PR)
npm run lint    # lint check
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Database | Turso/LibSQL (SQLite-compatible) |
| Authentication | BetterAuth (email/password) |
| i18n | next-intl (EN + DE) |

## Project Structure

```
src/
├── app/
│   ├── api/auth/         # BetterAuth API route
│   └── [locale]/         # i18n-aware routes (EN + DE)
│       ├── layout.tsx    # Root layout with navigation
│       ├── page.tsx      # Landing page
│       ├── login/        # Login page
│       ├── register/     # Registration page
│       └── recipes/
│           ├── page.tsx          # Recipe list
│           ├── new/              # Recipe creation form & server actions
│           ├── [id]/             # Recipe detail, edit, server actions
│           └── discover/         # Recipe discovery page
├── components/           # Shared UI components
│   ├── navigation.tsx        # Top nav with auth state
│   ├── recipe-card.tsx       # Recipe card with image, badges
│   ├── bookmark-button.tsx   # Bookmark toggle (authenticated)
│   ├── language-switcher.tsx # EN/DE switcher
│   └── ui/               # shadcn/ui primitives (button, card, input, badge, etc.)
├── db/                   # Database layer
│   ├── index.ts          # DB connection singleton (getDb())
│   ├── schema.ts         # Table definitions (recipes, auth tables)
│   ├── queries.ts        # Query functions
│   └── seed.ts           # Sample recipes for development
├── lib/                  # Utilities, types, auth
│   ├── auth.ts           # BetterAuth server config
│   ├── auth-client.ts    # Client hooks (useSession, signIn, signOut)
│   ├── auth-helpers.ts   # Server helpers (getSession, requireAuth)
│   ├── types.ts          # Shared TypeScript types
│   └── utils.ts          # shadcn/ui cn() utility
├── messages/             # i18n translation files
│   ├── en.json           # English
│   └── de.json           # German
└── test/
    ├── setup.ts          # Vitest setup
    └── e2e/              # Playwright E2E tests
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Local development
TURSO_DATABASE_URL=file:savourly.db
BETTER_AUTH_SECRET=dev-secret-change-in-production
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

For production (Vercel), use a hosted Turso database and set all vars in the Vercel dashboard.

## Testing

```bash
npm run test              # Unit tests (watch mode)
npm run test -- --run     # Unit tests (single run)
npm run test:coverage     # Coverage report
npm run test:e2e          # Playwright E2E tests
```

## Design System

**Warm, food-focused aesthetic.** Cream/off-white background, terracotta accent color, generous whitespace, large food photography, card-based layouts.

See `CLAUDE.md` for detailed design system documentation and `src/app/globals.css` for the theme variables.
