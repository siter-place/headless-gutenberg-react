# @siter/headless-gutenberg-react

Render WordPress Gutenberg content in any React app -- with CSS loading, HTML sanitization, and interactive block hydration.

Works with React, Lovable, Next.js, Vite, and any headless WordPress setup.

## Installation

```bash
npm install @siter/headless-gutenberg-react
```

Peer dependencies: `react` >= 18, `react-dom` >= 18.

## Quick Start

### Render a WordPress post by ID

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

For full control over fetching, CSS injection, and rendering:

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
      html={post.siter_headless?.rendered_html ?? post.content.rendered}
      assets={post.siter_headless}
    />
  );
}
```

## Layout Customization

WordPress themes define `--wp--style--global--content-size` and `--wp--style--global--wide-size` to control content and wide block widths. By default, these values come from the WordPress-generated CSS loaded via `siter_headless.css_urls`.

To override them for your site (e.g. to match your app's container width):

```tsx
<GutenbergRenderer
  html={html}
  assets={assets}
  contentSize="720px"
  wideSize="1200px"
/>
```

Or with the convenience component:

```tsx
<WordPressPageRenderer
  wpBaseUrl="https://your-wordpress-site.com"
  id={42}
  contentSize="720px"
  wideSize="1200px"
/>
```

When not provided, the values fall through to the WordPress theme CSS. This lets you use the theme defaults or override per-site.

## Interactivity

Interactive Gutenberg blocks work automatically. The package bundles the WordPress Interactivity API runtime and block view scripts locally -- no remote script loading or CORS configuration needed.

| Block | Behavior | Status |
|-------|----------|--------|
| Accordion | Expand/collapse sections | Working |
| Image lightbox | Click image to open fullscreen overlay | Working |
| Gallery | Multi-image lightbox with navigation | Working |
| Tabs | Tabbed content switching | Bundled |
| File | Download file blocks | Bundled |

### How it works

1. `GutenbergRenderer` renders WordPress HTML via ref-based DOM injection (outside React's virtual DOM).
2. `useInteractiveBlocks` detects `data-wp-interactive` attributes in the rendered DOM.
3. `injectServerData` extracts image metadata from the HTML and injects it as initial state for the interactivity runtime.
4. `injectLightboxOverlay` creates the lightbox overlay element that WordPress normally renders server-side in `wp_footer`.
5. The single `interactivity.js` bundle loads as an ES module containing the runtime + all block view scripts.
6. The runtime finds `[data-wp-interactive]` elements and hydrates them with Preact.

### Configuring the interactivity base path

By default, interactivity scripts are loaded from `/interactivity/`. If you serve them from a different path:

```tsx
<GutenbergRenderer
  html={html}
  assets={assets}
  interactivityBasePath="/custom/path/to/interactivity/"
/>
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
| `status` | `string` | `ready`, `dirty`, `generating`, `failed`, `missing` |
| `css_urls` | `string[]` | Generated CSS stylesheet URLs |
| `blocks` | `string[]` | Gutenberg block types used in the post |
| `rendered_html` | `string` | Full rendered HTML from WordPress |

### CORS Setup

Your WordPress site must send CORS headers for the React app's domain. The Siter plugin handles this. For custom setups:

```
Access-Control-Allow-Origin: https://your-app-domain.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## API Reference

### Components

#### `WordPressPageRenderer`

Fetches and renders a WordPress post/page. Handles loading, error states, CSS injection, and interactivity.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `wpBaseUrl` | `string` | (required) | WordPress site URL |
| `postType` | `string` | `'posts'` | REST API post type |
| `id` | `number` | -- | Post ID (provide `id` or `slug`) |
| `slug` | `string` | -- | Post slug (provide `id` or `slug`) |
| `htmlField` | `'rendered_html' \| 'content'` | `'rendered_html'` | Which field to use for HTML |
| `wrapperClass` | `string` | from `assets.wrapper` | Override wrapper CSS class |
| `siteBlocksClass` | `string` | `'wp-site-blocks'` | Override inner div class |
| `contentSize` | `string` | -- | Override `--wp--style--global--content-size` |
| `wideSize` | `string` | -- | Override `--wp--style--global--wide-size` |
| `interactivityBasePath` | `string` | `'/interactivity/'` | Path to interactivity bundle |
| `showTitle` | `boolean` | `false` | Render post title as `<h1>` |
| `loadingFallback` | `ReactNode` | `null` | Loading state UI |
| `errorFallback` | `ReactNode` | `null` | Error state UI |
| `className` | `string` | -- | Additional CSS class for outer wrapper |

#### `GutenbergRenderer`

Renders raw HTML with sanitization, wrapper class, layout overrides, and interactivity hydration.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `html` | `string` | (required) | HTML content to render |
| `assets` | `SiterHeadlessAssets` | -- | Asset metadata from REST response |
| `className` | `string` | -- | Additional CSS class for outer wrapper |
| `wrapperClass` | `string` | from `assets.wrapper` | Override wrapper CSS class |
| `siteBlocksClass` | `string` | `'wp-site-blocks'` | Inner div class |
| `contentSize` | `string` | -- | Override `--wp--style--global--content-size` |
| `wideSize` | `string` | -- | Override `--wp--style--global--wide-size` |
| `interactivityBasePath` | `string` | `'/interactivity/'` | Path to interactivity bundle |
| `sanitize` | `boolean` | `true` | Enable HTML sanitization |

### Hooks

#### `useWordPressContent(options)`

Fetches a WordPress post by ID or slug.

```typescript
const { post, loading, error, refetch } = useWordPressContent({
  wpBaseUrl: 'https://example.com',
  postType: 'pages',
  id: 42,
});
```

Returns `{ post, loading, error, refetch }`.

#### `useHeadlessAssets(cssUrls)`

Injects CSS `<link>` tags into the document head. Deduplicates, tracks load/error, cleans up on unmount.

```typescript
useHeadlessAssets(post?.siter_headless?.css_urls);
```

Returns `{ loaded, loading, error }`.

#### `useInteractiveBlocks(options)`

Loads the interactivity bundle for detected interactive blocks. Called internally by `GutenbergRenderer`.

Returns `{ loaded, error }`.

### Utilities

- **`sanitizeGutenbergHtml(html)`** -- Sanitizes HTML with DOMPurify, preserving `data-wp-*` attributes.
- **`normalizeWrapper(wrapper)`** -- Converts CSS selector (`.my-class`) to class name (`my-class`).

### Types

All types are exported for TypeScript consumers:

```typescript
import type {
  SiterHeadlessAssets,
  WordPressRenderedContent,
  GutenbergRendererProps,
  WordPressPageRendererProps,
  AssetStatus,
} from '@siter/headless-gutenberg-react';
```

## Lovable Integration

This package works in [Lovable](https://lovable.dev) apps:

```tsx
import { WordPressPageRenderer } from '@siter/headless-gutenberg-react';

export default function WordPressPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <WordPressPageRenderer
        wpBaseUrl="https://your-wordpress-site.com"
        postType="pages"
        slug="home"
        showTitle
        contentSize="720px"
        loadingFallback={<p className="text-gray-500">Loading...</p>}
        errorFallback={<p className="text-red-500">Could not load page.</p>}
      />
    </div>
  );
}
```

## Security

- All HTML is sanitized via DOMPurify before rendering. `<script>` tags and inline event handlers are stripped.
- `data-wp-*` attributes are preserved for WordPress Interactivity API compatibility.
- HTML is injected via ref-based `innerHTML` (outside React's virtual DOM) to prevent conflicts with interactivity hydration.
- CSS URLs are loaded only from the WordPress REST response.
- Interactivity scripts are bundled locally from npm packages -- no remote script loading from WordPress at runtime.

## Local Development

```bash
npm install
npm run dev       # playground at http://127.0.0.1:5173
npm run check     # typecheck + lint + test + build
npm run test:e2e  # Playwright browser tests
```

See [docs/quickstart.md](docs/quickstart.md) for daily commands and [docs/local-development.md](docs/local-development.md) for full setup.

## Publishing

Publishing uses GitHub Actions with npm trusted publishing (OIDC). A GitHub release triggers the publish workflow.

## Documentation

- [Quickstart](docs/quickstart.md) -- daily commands
- [Architecture](docs/architecture.md) -- system design and data flow
- [Testing Strategy](docs/testing-strategy.md) -- when and how to test
- [WordPress Integration Plan](docs/wordpress-integration-plan.md) -- REST API details
- [Roadmap](docs/roadmap.md) -- phased development plan

## License

MIT
