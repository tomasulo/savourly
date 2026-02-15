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
| Database | better-sqlite3 (local SQLite) |
| i18n | next-intl (EN + DE) |

## Project Structure

```
src/
├── app/              # App Router pages, layouts, server actions
├── components/       # Shared UI components
│   └── ui/           # shadcn/ui primitives (button, card, input, badge, etc.)
├── db/               # Database schema, connection, queries, seed data
│   ├── index.ts      # DB connection singleton
│   ├── schema.ts     # Table definitions & migrations
│   └── seed.ts       # Seed data for development
├── lib/              # Utilities, types, helpers
│   ├── utils.ts      # shadcn/ui cn() utility
│   └── types.ts      # Shared TypeScript types
└── messages/         # i18n translation files
    ├── en.json       # English translations
    └── de.json       # German translations
```

## Development Workflow

This repo is developed entirely by AI agents orchestrated by a PM agent. See `CLAUDE.md` for full conventions.

### Agent Roles
- **PM (Opus):** Creates issues, plans sprints, orchestrates workflow, merges PRs
- **Coding Agent (Sonnet):** Implements features on branches, opens PRs
- **QA Agent (Sonnet):** Reviews PRs for correctness, quality, design compliance

### Issue Lifecycle
```
PM creates issue → Coding Agent implements → PR created
    → QA Agent reviews → Approved → PM merges
                       → Changes requested → Coding Agent fixes → re-review
```

## Design System

**Warm, food-focused aesthetic.** Cream/off-white background, terracotta accent color, generous whitespace, large food photography, card-based layouts.

See `CLAUDE.md` for detailed design system documentation and `src/app/globals.css` for the theme variables.
