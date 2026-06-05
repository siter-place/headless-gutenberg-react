# Quickstart

A short guide for new developers. For expanded setup and troubleshooting, see [local-development.md](local-development.md).

## Prerequisites

- Node.js 22+
- npm (not pnpm)

## First-time setup

```bash
git clone <repo-url>
cd wp-gutenberg-content-renderer
npm install
npm run prepare:e2e   # downloads Playwright's Chromium browser (first time only)
```

## Daily development

```bash
npm run dev
```

Opens the Vite playground at `http://127.0.0.1:5173`.

- Edit library source in `src/`.
- Edit playground UI in `playground/src/`.
- Changes hot-reload automatically.
- Load a WordPress post by entering the Post ID and clicking "Load Post".
- Interactivity (accordion) works out of the box with locally bundled scripts.

## Before opening a PR

```bash
npm run check
```

This runs typecheck, lint, unit tests, and build in sequence. All must pass.

## Test commands

| Command | What it does |
|---------|-------------|
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run Playwright browser tests (starts playground automatically) |
| `npm run test:e2e:ui` | Run Playwright with interactive UI |

## Build

```bash
npm run build
```

Produces `dist/` with ESM (`index.js`), CommonJS (`index.cjs`), TypeScript declarations (`index.d.ts`), and the interactivity bundle (`interactivity/interactivity.js`).

## Lint and format

```bash
npm run lint          # check for lint errors
npm run format        # auto-format all files with Prettier
```

## Project structure

```
src/                  # library source (published to npm)
  components/         # React components (GutenbergRenderer, WordPressPageRenderer, HelloWorld)
  hooks/              # React hooks (useWordPressContent, useHeadlessAssets, useInteractiveBlocks)
  lib/                # utilities (sanitize, normalizeWrapper, loadScriptModule, injectServerData, wp-interactive-blocks)
  types/              # TypeScript type definitions
scripts/              # build scripts (build-interactivity.mjs)
playground/           # local Vite dev app (not published)
e2e/                  # Playwright browser tests
docs/                 # expanded documentation
.cursor/rules/        # Cursor agent rules
.agents/skills/       # Cursor agent skills
```

## Deploy / publish

Published to npm as `@siter/headless-gutenberg-react`. CI validates on push and PR to `main`. Publishing uses GitHub Actions with npm trusted publishing (OIDC) triggered by GitHub releases.

## Where to go next

- [local-development.md](local-development.md) -- full setup, playground architecture, troubleshooting
- [testing-strategy.md](testing-strategy.md) -- when to add unit vs. browser tests
- [architecture.md](architecture.md) -- system design and data flow
- [roadmap.md](roadmap.md) -- phased development plan
- [AGENTS.md](../AGENTS.md) -- Cursor agent workflow and completion criteria
