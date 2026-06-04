# Local Development

Comprehensive guide for setting up and working with the project locally.

Primary audience: AI coding agents. Secondary audience: human developers.

For a minimal command-only reference, see [quickstart.md](quickstart.md).

## Development Workflow

```mermaid
flowchart LR
    Clone["git clone"] --> Install["npm install"]
    Install --> Dev["npm run dev"]
    Dev --> Edit["Edit src/ or playground/src/"]
    Edit -->|"hot reload"| Dev
    Edit --> Test["npm run test"]
    Test --> Check["npm run check"]
    Check --> PR["Open PR"]
```

## First-Time Setup

### Prerequisites

- Node.js 22 or later
- npm (not pnpm or yarn)
- Git

### Clone and install

```bash
git clone <repo-url>
cd wp-gutenberg-content-renderer
npm install
```

### Install Playwright browsers (first time only)

```bash
npm run prepare:e2e
```

This downloads the Chromium browser binary used by Playwright. It only needs to run once per machine.

## Running the Playground

```bash
npm run dev
```

Opens the Vite development server at `http://127.0.0.1:5173`.

### Playground Architecture

The playground is a separate Vite app in `playground/` that imports the library source directly:

```mermaid
flowchart TD
    PlaygroundApp["playground/src/App.tsx"] -->|"import from '../../src'"| LibSource["src/index.ts"]
    LibSource --> HelloWorld["src/components/HelloWorld.tsx"]
    ViteConfig["playground/vite.config.ts"] -->|"serves"| PlaygroundApp
    RootDev["npm run dev"] -->|"npm --prefix playground run dev"| ViteConfig
```

Key points:
- The playground imports directly from `../../src`, not from a built `dist/` package.
- Changes to library source files hot-reload in the playground immediately.
- The playground has its own `package.json` with its own dependencies (react, react-dom, vite).
- The playground's `tsconfig.json` extends the root `tsconfig.json`.

### What to edit

| Area | Directory | Purpose |
|------|-----------|---------|
| Library source | `src/` | Components, hooks, types that ship in the npm package |
| Playground UI | `playground/src/` | Local demo app for manual testing |
| Unit tests | `src/**/__tests__/` | Vitest + React Testing Library tests |
| Browser tests | `e2e/` | Playwright tests against the playground |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start playground dev server |
| `npm run build` | Build library to `dist/` (ESM, CJS, .d.ts) |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run Playwright tests (auto-starts playground) |
| `npm run test:e2e:ui` | Run Playwright with interactive UI |
| `npm run lint` | Run ESLint |
| `npm run format` | Auto-format with Prettier |
| `npm run check` | Run typecheck + lint + test + build in sequence |
| `npm run prepare:e2e` | Install Playwright browser binaries |

## Build Output

`npm run build` uses tsup to produce:

```
dist/
├── index.js      # ESM module
├── index.cjs     # CommonJS module
├── index.d.ts    # TypeScript declarations
└── index.js.map  # Source map
```

React and ReactDOM are externalized (not bundled).

## Future: Local WordPress Testing

Later phases will support testing against a local WordPress REST API.

### Expected local setup

A local WordPress instance (e.g., via Docker or Local) with the Siter plugin installed.

### Expected endpoint

```
http://localhost/wp-json/wp/v2/pages/{id}?siter_headless=1
```

### Future playground configuration

The playground will support configuring:
- WordPress base URL
- Post type (pages, posts, custom)
- Post ID or slug

## Troubleshooting

### `npm install` fails

- Ensure Node.js 22+ is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then retry: `rm -rf node_modules package-lock.json && npm install`

### Playground does not start

- Ensure playground dependencies are installed: `cd playground && npm install && cd ..`
- Check that port 5173 is not already in use

### Playwright tests fail to start

- Run `npm run prepare:e2e` to install browser binaries
- On CI, use `npx playwright install --with-deps chromium` to include system dependencies

### TypeScript errors in playground

- The playground `tsconfig.json` extends the root. If new source directories are added, update the root `tsconfig.json` `include` array.

### ESLint reports errors in generated files

- The ESLint config ignores `dist/`, `coverage/`, `playground/dist/`, `playwright-report/`, and `test-results/`. If new generated directories appear, add them to the ignores in `eslint.config.js`.
