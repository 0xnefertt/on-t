# On T

A full-stack monorepo for learning frontend and backend development with TypeScript.

## Tech stack

- **Workspace:** pnpm and Turborepo
- **Frontend:** Next.js App Router, React, and TanStack Query
- **Backend:** Express, Zod, and Pino
- **Shared:** `@on-t/shared` for API schemas and shared types
- **Quality:** TypeScript 7 native compiler, ESLint, Prettier, and Jest

## Getting started

Node.js 22 or newer and pnpm are required.

```bash
pnpm install
pnpm dev
```

- Web: <http://localhost:3000>
- API: <http://localhost:3001/api/health>

Next.js rewrites `/api` requests to Express, so no additional configuration is needed to run both apps locally.

For a deployed web app, set `API_ORIGIN` to the public origin of the Express deployment. Copy `.env.example` when you need a local environment file.

## Commands

```bash
pnpm dev          # Start all development servers
pnpm build        # Build the entire workspace
pnpm typecheck    # Check TypeScript types
pnpm lint         # Run ESLint
pnpm test         # Run all tests
pnpm format       # Format files with Prettier
```

You can also run an individual app.

```bash
pnpm --filter @on-t/web dev
pnpm --filter @on-t/api dev
```

## Project structure

```text
.
├── apps
│   ├── api       # Express API
│   └── web       # Next.js web app
├── packages
│   └── shared    # Schemas and types shared by the frontend and backend
├── eslint.config.js
├── tsconfig.base.json
└── turbo.json
```

Start with `packages/shared/src/index.ts` to see how the same schemas validate API responses on the server and at runtime in the Next.js app. Then inspect `apps/web/src/app` to learn the App Router structure and the server/client component boundary.

## React practice page

The home route contains three interactive React exercises written with strict TypeScript:

- Numeric state with functional updates
- A typed checklist with derived progress
- A controlled form with typed events and a discriminated union

Read the feature in this order:

```text
apps/web/src/features/react-practice/
├── types.ts                     # Data shapes and literal unions
├── data.ts                      # Checked example data with satisfies
├── components/TypedList.tsx     # A reusable generic component
├── components/CounterExercise.tsx
├── components/TopicChecklist.tsx
├── components/GoalForm.tsx
└── ReactPracticePage.tsx        # Page composition
```

Change one type or state transition at a time, run `pnpm typecheck`, and use the compiler error as feedback.

### TypeScript toolchain

The workspace uses the TypeScript 7 native compiler for `tsc` and type-checking. TypeScript 6 is installed as a compatibility API for tools such as Next.js and typescript-eslint that still access the compiler programmatically.

```bash
pnpm exec tsc --version   # TypeScript 7 native compiler
pnpm exec tsc6 --version  # TypeScript 6 compatibility compiler
```
