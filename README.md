# @siter/headless-gutenberg-react

React package foundation for rendering WordPress Gutenberg content in headless React and Lovable applications.

## Status

This project is in Phase 1.

Current functionality:
- TypeScript library setup
- React package build setup
- Vite playground
- Unit testing
- Playwright testing
- Basic `HelloWorld` component

Full Gutenberg rendering is planned for later phases.

## Quickstart

For the full day-to-day command reference, see [docs/quickstart.md](docs/quickstart.md).

```bash
npm install
npm run dev       # playground at http://127.0.0.1:5173
npm run check     # typecheck + lint + test + build
```

## Current Usage

```tsx
import { HelloWorld } from '@siter/headless-gutenberg-react';

export function App() {
  return <HelloWorld name="Siter" />;
}
```

## Local Development

Run the playground:

```bash
npm run dev
```

Open:

```
http://127.0.0.1:5173
```

## Testing

Run unit tests:

```bash
npm run test
```

Run Playwright tests:

```bash
npm run test:e2e
```

Run full check:

```bash
npm run check
```

## Long-Term Goal

The final package will render WordPress Gutenberg content from REST API responses:

```
/wp-json/wp/v2/pages/{id}?siter_headless=1
```

It will consume:

* `content.rendered`
* `siter_headless.wrapper`
* `siter_headless.css_urls`
* `siter_headless.blocks`

## Architecture

The package will not convert Gutenberg blocks into React components.

WordPress remains the source of truth for rendered Gutenberg HTML.

React will be responsible for:

* safe rendering
* CSS asset loading
* optional interactivity hydration
* developer-friendly integration in Lovable and React apps

## Publishing

Not published to npm yet. Future publishing will use GitHub Actions with npm trusted publishing (OIDC) instead of long-lived npm tokens.

## Documentation

* [Quickstart](docs/quickstart.md) — daily commands for developers
* [Architecture](docs/architecture.md) — system design and data flow
* [Local Development](docs/local-development.md) — setup, playground, troubleshooting
* [Testing Strategy](docs/testing-strategy.md) — when and how to test
* [WordPress Integration Plan](docs/wordpress-integration-plan.md) — future REST API integration
* [Roadmap](docs/roadmap.md) — phased development plan
* [AGENTS.md](AGENTS.md) — Cursor agent workflow

## License

MIT
