# KOL Tracker - Copilot Instructions

## Project Overview

**KOL Tracker** is a Next.js 16 application displaying a leaderboard of cryptocurrency influencers (KOLs). It fetches data from a Supabase backend and renders a sortable/filterable table with real-time user statistics.

### Tech Stack
- **Framework**: Next.js 16 (App Router, Server Components)
- **Styling**: Tailwind CSS 4 with CSS variables
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript (strict mode)
- **Icons**: Lucide React
- **Auth**: next-auth + Supabase Auth Helpers (configured but not actively used)

## Architecture Patterns

### Data Flow
1. **Entry Point** (`src/app/page.tsx`) → renders `<LeaderBoard />` component
2. **LeaderBoard Component** (`src/components/LeaderBoard.tsx`) → async function that:
   - Calls `/api/kols` route
   - On server-side build/SSR: hits `http://localhost:3000/api/kols` (absolute URL)
   - On client: hits `/api/kols` (relative URL, via `typeof window === "undefined"` check)
   - Implements **60-second ISR** (`next: { revalidate: 60 }`) for cache invalidation
3. **API Route** (`src/app/api/kols/route.ts`) → fetches from Supabase or returns mock data if env vars missing
4. **UI Components** → composed from `src/components/ui/` (avatar, badge, table, card)

### Key Architectural Decisions

- **Server-side fetching**: Data fetched in async component, not in useEffect (Next.js 13+ pattern)
- **Build resilience**: Mock fallback data when Supabase credentials absent (critical for Vercel builds without secrets)
- **Styling abstraction**: `cn()` utility merges Tailwind classes (uses `clsx` + `tailwind-merge` in `src/lib/utils.ts`)
- **Component library**: Shadcn/ui components in `src/components/ui/` with CVA (class-variance-authority) for variants

## Development Workflow

### Commands
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Run production server
npm run lint         # ESLint check (ESLint 9 + Next.js config)
```

### Environment Setup
- **Required**: `.env.local` with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- **Optional**: Auth-related vars if expanding auth functionality
- **Note**: `NEXT_PUBLIC_*` prefix required (exposed to browser)

### Build Process
- Next.js 16 with TypeScript strict mode
- Path alias `@/*` → `./src/*` (configured in `tsconfig.json`)
- Tailwind 4 with PostCSS (auto-prefixed CSS variables)

## Project-Specific Conventions

### Component Structure
- **UI Components** (`src/components/ui/`) → Pure, composable Radix primitives with Tailwind styling
- **Feature Components** (`src/components/LeaderBoard.tsx`) → Business logic, data fetching, layout
- **Async Components**: Server components used directly (no `"use client"` needed unless adding interactivity)

### Type Definitions
- Inline type declarations preferred (e.g., `type Kol = { ... }` in component files)
- Use strict TypeScript (`strict: true` in tsconfig)

### Styling
- Tailwind classes via `className` prop
- Merge conflicting classes with `cn()` function (e.g., `cn("px-4 px-6")` → "px-6")
- CSS variables defined in `src/app/globals.css` (Tailwind 4 format)

### Data Handling
- Temporary stats generation: `accuracy`, `calls`, `roi` computed server-side (placeholder logic in `/api/kols`)
- Avatar URLs: Fallback to `https://unavatar.io/x/{username}` (unavatar service)
- Null coalescing for missing Supabase data (returns empty array if `data` is null)

## Integration Points

### Supabase
- **Endpoint**: `kols` table (columns: id, username, display_name, avatar_url, badge, + more)
- **Query**: `select('*').order('id')` in `src/app/api/kols/route.ts`
- **Client Library**: `@supabase/supabase-js` v2.86

### API Routes
- Location: `src/app/api/**/*` (Next.js App Router convention)
- Handler: Exported function (e.g., `export async function GET()`)
- Response: `NextResponse.json()` for consistency

## Common Tasks

### Adding a New UI Component
1. Create component in `src/components/ui/{name}.tsx` using Radix primitives
2. Use Tailwind classes + CVA for variants
3. Import and use in feature components

### Fetching New Data
1. Add new API route in `src/app/api/{resource}/route.ts`
2. Implement mock fallback for missing env vars
3. Use 60-second revalidation if data changes infrequently (`next: { revalidate: 60 }`)

### Styling Changes
- Modify `src/app/globals.css` for global styles or CSS variables
- Use `cn()` in components to conditionally merge Tailwind classes
- Reference Tailwind docs for responsive breakpoints (e.g., `md:`, `lg:`)

## Warnings & Gotchas

- **Build failures**: If Supabase vars missing, app falls back to mock data (intentional). Check env config if production data missing.
- **Relative URLs**: LeaderBoard uses `typeof window === "undefined"` to detect SSR context (required for Next.js 13+ App Router async components).
- **Class conflicts**: Always use `cn()` when merging Tailwind classes to handle conflicts correctly.
- **Language**: Components use French comments (e.g., "revalidate toutes les 60 secondes") — maintain consistency.

## Testing & Debugging

- **No test suite configured** — add Jest/Vitest if needed
- **ESLint**: Run `npm run lint` to check code style
- **Type checking**: TypeScript errors shown in editor; run `npm run build` to validate for production
