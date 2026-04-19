# Claims Platform Starter

It combines architecture documentation, diagrams, and a React skeleton that reflects the same design decisions.

## Why This Structure
- The grid is designed for server-side filtering, sorting, and pagination because 20k+ records should not be loaded or reshaped entirely in the browser.
- The document workspace is modeled around manifest-first loading, signed asset access, and async jobs for split and merge rather than pretending the browser can safely edit 1GB binaries directly.
- Authorization is backend-enforced. The frontend only shapes UX using capability flags.

## Stack
- React + TypeScript + Vite
- React Router
- TanStack Query for server state
- Zustand for UI-only state
- MSW for mock APIs
- Vitest + React Testing Library

## Local Setup
1. Install dependencies with `npm install`.
2. Start the app with `npm run dev`.
3. Run tests with `npm test`.
4. Type-check with `npm run lint`.

## Code Layout
- `src/app/`: providers, router, app startup, global styles.
- `src/routes/`: route-level entry points.
- `src/features/claims-grid/`: server-driven claims list module.
- `src/features/document-workspace/`: manifest-first workspace and async job placeholder actions.
- `src/features/annotations/`: comments and annotation panels.
- `src/services/`: typed service contracts for claims, documents, jobs, and annotations.
- `src/store/`: Zustand UI store.
- `src/mocks/`: MSW handlers and sample data.

## Architecture Choices Reflected In Code
- TanStack Query owns networked server state so retries, loading states, and cache invalidation are centralized.
- Zustand only stores local UI concerns such as the active workspace panel.
- The grid is implemented as a reusable `ServerDataGrid` abstraction to keep server-side list operations explicit.
- The document workspace is intentionally a placeholder shell so it is easy to explain where real PDF rendering, Web Workers, and background job polling would integrate.
