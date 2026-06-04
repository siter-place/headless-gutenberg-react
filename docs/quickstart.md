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

Produces `dist/` with ESM (`index.js`), CommonJS (`index.cjs`), and TypeScript declarations (`index.d.ts`).

## Lint and format

```bash
npm run lint          # check for lint errors
npm run format        # auto-format all files with Prettier
```

## Project structure

```
src/                  # library source (published to npm)
playground/           # local Vite dev app (not published)
e2e/                  # Playwright browser tests
docs/                 # expanded documentation
.cursor/rules/        # Cursor agent rules
.cursor/skills/       # Cursor agent skills
```

## Deploy / publish

Not published to npm yet. CI validates automatically on push and PR to `main`.

Future publishing will use GitHub Actions with npm trusted publishing (OIDC) instead of long-lived npm tokens.

## Where to go next

- [local-development.md](local-development.md) — full setup, playground architecture, troubleshooting
- [testing-strategy.md](testing-strategy.md) — when to add unit vs. browser tests
- [architecture.md](architecture.md) — long-term product design and data flow
- [roadmap.md](roadmap.md) — what each phase delivers
- [AGENTS.md](../AGENTS.md) — Cursor agent workflow and completion criteria
