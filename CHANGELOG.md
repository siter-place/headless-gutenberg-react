# Changelog

## 0.1.0

Full implementation of the headless Gutenberg React renderer:

### Components
- `GutenbergRenderer` -- renders sanitized WordPress HTML with wrapper class and asset status handling
- `WordPressPageRenderer` -- convenience component that fetches and renders a WordPress post/page
- `HelloWorld` -- test component (Phase 1 placeholder)

### Hooks
- `useWordPressContent` -- fetches WordPress posts/pages by ID or slug from the REST API
- `useHeadlessAssets` -- injects and manages CSS `<link>` tags from `siter_headless.css_urls`
- `useInteractiveBlocks` -- loads WordPress Interactivity API runtime and block view scripts

### Utilities
- `sanitizeGutenbergHtml` -- DOMPurify-based sanitization preserving `data-wp-*` attributes
- `normalizeWrapper` -- converts CSS selector to class name

### Types
- `SiterHeadlessAssets`, `WordPressRenderedContent`, `GutenbergRendererProps`, `WordPressPageRendererProps`

### Infrastructure
- TypeScript strict mode with tsup build (ESM + CJS + declarations)
- Vitest unit tests with React Testing Library
- Playwright E2E tests with live WordPress data
- Vite playground with WordPress REST API proxy
- GitHub Actions CI and npm publish workflows
- DOMPurify as the sole production dependency
