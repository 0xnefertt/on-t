# On T

A full-stack monorepo for learning frontend and backend development with TypeScript.

## Tech stack

- **Workspace:** pnpm and Turborepo
- **Frontend:** React, Vite, and TanStack Query
- **Backend:** Express, Zod, and Pino
- **Shared:** `@on-t/shared` for API schemas and shared types
- **Quality:** TypeScript strict mode, ESLint, Prettier, and Vitest

## Getting started

Node.js 22 or newer and pnpm are required.

```bash
pnpm install
pnpm dev
```

- Web: <http://localhost:5173>
- API: <http://localhost:3001/api/health>

The Vite development server proxies `/api` requests to Express, so no additional configuration is needed to run both apps locally.

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
│   └── web       # React web app
├── packages
│   └── shared    # Schemas and types shared by the frontend and backend
├── eslint.config.js
├── tsconfig.base.json
└── turbo.json
```

Start with `packages/shared/src/index.ts` to see how the same schemas validate API responses on the server and at runtime in the web app.
