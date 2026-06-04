# @siter/headless-gutenberg-react

The simplest bridge between WordPress Gutenberg and React frontends.

Renders WordPress REST API content in React, Lovable, and any headless React app -- with CSS loading, HTML sanitization, and optional interactivity hydration.

## Installation

```bash
npm install @siter/headless-gutenberg-react
```

Peer dependencies: `react` >= 18, `react-dom` >= 18.

## Quick Start

### Render a WordPress post

```tsx
import { WordPressPageRenderer } from '@siter/headless-gutenberg-react';

export function BlogPost() {
  return (
    <WordPressPageRenderer
      wpBaseUrl="https://your-wordpress-site.com"
      id={42}
      showTitle
      loadingFallback={<p>Loading...</p>}
      errorFallback={<p>Failed to load content.</p>}
    />
  );
}
```

### Render by slug

```tsx
<WordPressPageRenderer
  wpBaseUrl="https://your-wordpress-site.com"
  postType="pages"
  slug="about"
  showTitle
/>
```

### Manual control with hooks

```tsx
import {
  useWordPressContent,
  GutenbergRenderer,
  useHeadlessAssets,
} from '@siter/headless-gutenberg-react';

export function CustomRenderer() {
  const { post, loading, error } = useWordPressContent({
    wpBaseUrl: 'https://your-wordpress-site.com',
    postType: 'pages',
    id: 42,
  });

  useHeadlessAssets(post?.siter_headless?.css_urls);

  if (loading) return <p>Loading...</p>;
  if (error || !post) return <p>Error loading content.</p>;

  return (
    <GutenbergRenderer
      html={post.content.rendered}
      assets={post.siter_headless}
    />
  );
}
```

## Lovable Integration

This package works in [Lovable](https://lovable.dev) apps. Install the package and use `WordPressPageRenderer` or the hooks directly.

```tsx
// In a Lovable-generated React app
import { WordPressPageRenderer } from '@siter/headless-gutenberg-react';

export default function WordPressPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <WordPressPageRenderer
        wpBaseUrl="https://your-wordpress-site.com"
        postType="pages"
        slug="home"
        showTitle
        loadingFallback={<p className="text-gray-500">Loading...</p>}
        errorFallback={<p className="text-red-500">Could not load page.</p>}
      />
    </div>
  );
}
```

### CORS Setup

Your WordPress site must send CORS headers for the React app's domain. The Siter plugin handles this. If using a custom setup, add these headers to your WordPress server:

```
Access-Control-Allow-Origin: https://your-app-domain.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## WordPress REST API

The package fetches from the WordPress REST API with the `?siter_headless=1` parameter:

```
GET /wp-json/wp/v2/posts/{id}?siter_headless=1
GET /wp-json/wp/v2/pages?slug={slug}&siter_headless=1
```

The `siter_headless` response field provides:

| Field | Type | Description |
|-------|------|-------------|
| `wrapper` | `string` | CSS class selector for the content wrapper |
| `status` | `string` | Asset status: `ready`, `dirty`, `generating`, `failed`, `missing` |
| `css_urls` | `string[]` | Generated CSS stylesheet URLs |
| `blocks` | `string[]` | Gutenberg block types used in the post |

## API Reference

### Components

- **`WordPressPageRenderer`** -- Fetches and renders a WordPress post/page. Handles loading, error, and CSS injection.
- **`GutenbergRenderer`** -- Renders raw HTML with sanitization, wrapper class, and asset status handling.
- **`HelloWorld`** -- Test component (Phase 1 placeholder).

### Hooks

- **`useWordPressContent(options)`** -- Fetches a WordPress post by ID or slug. Returns `{ post, loading, error, refetch }`.
- **`useHeadlessAssets(cssUrls)`** -- Injects CSS `<link>` tags into the document head. Returns `{ loaded, loading, error }`.
- **`useInteractiveBlocks(options)`** -- Loads WordPress Interactivity API runtime and block scripts. Returns `{ loaded, error }`.

### Utilities

- **`sanitizeGutenbergHtml(html)`** -- Sanitizes HTML with DOMPurify, preserving `data-wp-*` attributes for interactivity.
- **`normalizeWrapper(wrapper)`** -- Converts CSS selector (`.my-class`) to class name (`my-class`).

## Security

- All HTML from `content.rendered` is sanitized via DOMPurify before rendering.
- `data-wp-*` attributes are preserved for WordPress Interactivity API compatibility.
- `<script>` tags and inline event handlers are stripped.
- CSS URLs are loaded only from the WordPress REST response.
- Script modules for interactivity are loaded only from the specified `wpBaseUrl`.

## Local Development

```bash
npm install
npm run dev       # playground at http://127.0.0.1:5173
npm run check     # typecheck + lint + test + build
npm run test:e2e  # Playwright browser tests
```

## Publishing

Publishing uses GitHub Actions with npm trusted publishing (OIDC). A GitHub release triggers the publish workflow which runs all checks and publishes with provenance.

## Documentation

- [Quickstart](docs/quickstart.md) -- daily commands
- [Architecture](docs/architecture.md) -- system design and data flow
- [Testing Strategy](docs/testing-strategy.md) -- when and how to test
- [WordPress Integration Plan](docs/wordpress-integration-plan.md) -- REST API details
- [Roadmap](docs/roadmap.md) -- phased development plan

## License

MIT
