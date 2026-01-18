# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Daily Wrap is a Korean news briefing service that automatically collects, summarizes, and curates daily news using AI. Target audience is busy professionals. Revenue model: free web + paid Kakao Open Chat subscription.

## Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript 5
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4, shadcn/ui (radix-vega style)
- **Database**: Supabase (Postgres) - planned
- **AI**: Claude API for news summarization - planned
- **Deployment**: Vercel

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages and layouts
- `components/ui/` - shadcn UI components (CVA-based variants)
- `lib/utils.ts` - Utility functions including `cn()` for className composition
- `docs/` - Project specs, design guide, task tracker (Korean)

### Path Aliases
- `@/*` maps to project root (e.g., `@/components`, `@/lib`)

### Component Patterns
- Use CVA (class-variance-authority) for component variants
- Use `cn()` utility for Tailwind class merging
- Components accept `className` prop for composition
- Radix UI Slot pattern for "asChild" polymorphism

## Design System

Editorial broadsheet newspaper aesthetic with:

**Colors**:
- Background: Warm Cream (#F8F6F1)
- Text: Charcoal (#1A1A1A), Slate Gray (#4A4A4A)
- Sections: Politics Red (#C41E3A), Economy Green (#2D4A3E), Society Brown (#8B4513)

**Typography** (serif-focused):
- Headlines: Playfair Display
- Body EN: Source Serif 4
- Body KR: Noto Serif KR
- UI/Dates: Cormorant Garamond

See [docs/design-editorial-broadsheet.md](docs/design-editorial-broadsheet.md) for full specification.

## Planned API Routes

- `GET /api/briefings` - List recent briefings
- `GET /api/briefings/[date]` - Get briefing by date
- `POST /api/beta-signup` - Beta signup
- `POST /api/revalidate` - ISR cache invalidation

## Development Phases

Project follows 6 phases with 51 tasks tracked in [docs/task.md](docs/task.md):
1. Design System (fonts, colors, components)
2. Database & API (Supabase, schemas, routes)
3. News Pipeline (RSS fetching, AI summarization, GitHub Actions)
4. Web App (pages, responsive design)
5. Beta Features (signup, Kakao integration)
6. Deployment (SEO, performance, testing)

## Language

Documentation and UI text are in Korean.
