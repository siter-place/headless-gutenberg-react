# Changelog

## 1.0.3

### Features
- Gallery lightbox now works: the lightbox overlay HTML (normally rendered server-side by WordPress in `wp_footer`) is injected client-side by `injectLightboxOverlay` before the interactivity runtime hydrates
- Added `contentSize` and `wideSize` props to `GutenbergRenderer` and `WordPressPageRenderer` for overriding WordPress `--wp--style--global--content-size` and `--wp--style--global--wide-size` CSS custom properties

### Tests
- Added unit tests for `injectLightboxOverlay` (overlay injection, idempotency, reset, structural children)
- Added unit tests for `contentSize`/`wideSize` CSS custom property application
- Added Playwright E2E test for gallery lightbox open/close

### Documentation
- Rewrote README for developer integration clarity: layout customization section, updated interactivity table, full props reference
- Updated architecture docs: lightbox overlay injection in data flow, removed known limitation
- Updated CHANGELOG

## 1.0.2

### Bug Fixes
- Fixed interactivity hydration architecture: replaced import-map-based loading with a single `interactivity.js` bundle containing the runtime and all block view scripts, eliminating race conditions between runtime hydration and store registration
- Switched `GutenbergRenderer` from `dangerouslySetInnerHTML` to ref-based `innerHTML` injection via `useLayoutEffect`, preventing React StrictMode's double-mount from destroying interactivity-hydrated DOM elements
- Added `injectServerData` to extract image metadata from rendered HTML and inject it as a `wp-script-module-data` JSON script tag, replacing the server-provided initial state that WordPress normally renders
- Added `setTimeout(0)` deferral in `useInteractiveBlocks` for DOM stability after React's render cycle

### Tests
- Updated unit tests for `useInteractiveBlocks` to handle deferred loading with fake timers
- Updated Playwright E2E tests: accordion expand/collapse assertions, interactivity hydration verification
- Removed gallery lightbox E2E test (requires server-rendered overlay HTML not present in REST API response)

### Documentation
- Updated all docs to reflect single-bundle interactivity architecture
- Documented ref-based HTML injection strategy and rationale
- Documented `injectServerData` role in the data flow
- Added known limitation: gallery lightbox requires server-rendered overlay HTML

## 1.0.1

### Bug Fixes
- Fixed interactivity hydration for accordion and gallery lightbox blocks
- Block view scripts now load directly as ES modules (runtime loads as their import dependency via import map), fixing the timing issue where the interactivity runtime would hydrate before stores were registered

### Tests
- Added Playwright E2E tests for accordion expand/collapse and gallery lightbox open/close
- Updated unit tests to verify block scripts load without a separate runtime script

### Documentation
- Updated all docs to reflect current implementation state (all phases complete)
- Added interactivity architecture documentation with loading order details
- Updated README with full API reference, interactivity section, and component props

## 1.0.0

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
- Local interactivity bundles from @wordpress/interactivity and @wordpress/block-library
- DOMPurify for HTML sanitization
