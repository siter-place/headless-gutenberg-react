---
name: Headless Gutenberg React Package
overview: Implement a public npm React + TypeScript package (@siter/headless-gutenberg-react) from scratch in an empty repo. The package renders WordPress Gutenberg content via REST API, loads generated CSS, sanitizes HTML, and optionally hydrates WordPress Interactivity API blocks -- following the phased MVP roadmap from the spec.
todos:
  - id: scaffold
    content: Create package.json, tsconfig.json, tsup.config.ts, .eslintrc.cjs, .prettierrc, .gitignore, LICENSE, empty src/index.ts -- then run npm install
    status: pending
  - id: types
    content: Create src/types/wordpress.ts with all interfaces (SiterHeadlessAssets, WordPressRenderedContent, props types)
    status: pending
  - id: sanitize
    content: Create src/lib/sanitize.ts and src/lib/normalizeWrapper.ts with DOMPurify config preserving data-wp-* attrs + tests
    status: pending
  - id: css-hook
    content: Create src/hooks/useHeadlessAssets.ts for injecting/cleaning up CSS link elements + tests
    status: pending
  - id: renderer
    content: Create src/components/GutenbergRenderer.tsx composing sanitize + CSS hook + status handling + tests
    status: pending
  - id: fetch-hook
    content: Create src/hooks/useWordPressContent.ts for REST API fetching by id/slug + tests
    status: pending
  - id: page-renderer
    content: Create src/components/WordPressPageRenderer.tsx convenience component + tests
    status: pending
  - id: interactivity
    content: Create src/lib/wp-interactive-blocks.ts, src/lib/loadScriptModule.ts, src/hooks/useInteractiveBlocks.ts + tests
    status: pending
  - id: barrel
    content: Wire up src/index.ts barrel exports for all components, hooks, and types
    status: pending
  - id: playground
    content: Create playground/ Vite demo app with configurable WordPress connection
    status: pending
  - id: ci-publish
    content: Create .github/workflows/ci.yml and .github/workflows/publish.yml
    status: pending
  - id: docs
    content: Create README.md and CHANGELOG.md with installation, usage examples, and WP requirements
    status: pending
isProject: false
---

# Headless Gutenberg React Package -- Implementation Plan

The workspace is a fresh empty git repo. Every file will be created from scratch following the provided specification.

---

## Phase 1: Project scaffolding and build tooling

Set up the foundation so subsequent phases can build, typecheck, and test incrementally.

**Files to create:**

- `package.json` -- as specified in section 8, with tsup/vite/vitest/eslint dev deps, react/react-dom peer deps, dompurify dependency
- `tsconfig.json` -- strict TypeScript config targeting ES2020/ESNext modules, JSX react-jsx, with `src` include
- `tsup.config.ts` -- entry `src/index.ts`, formats `esm` + `cjs`, `dts: true`, `clean: true`, externalize `react` and `react-dom`
- `.eslintrc.cjs` -- TypeScript + React lint config
- `.prettierrc` -- standard formatting config
- `.gitignore` -- node_modules, dist, coverage, .env, etc.
- `LICENSE` -- MIT
- `src/index.ts` -- barrel export (initially empty, grows with each phase)

After scaffolding, run `npm install` to verify lockfile and dependency resolution.

---

## Phase 2: Types (section 3 of spec)

**File:** `src/types/wordpress.ts`

Define all shared interfaces:

- `SiterHeadlessAssets` -- wrapper, status union, is_stale, css_urls, blocks, optional fields
- `WordPressRenderedContent` -- id, title, content, excerpt, siter_headless
- `GutenbergRendererProps` -- html, assets, wpBaseUrl, className, enableInteractivity, sanitize, loadingFallback, onAssetStatusChange
- `WordPressPageRendererProps` -- wpBaseUrl, postType, id/slug, enableInteractivity, className, showTitle, loadingFallback, errorFallback

Export all types from `src/index.ts`.

---

## Phase 3: Sanitization (section 7 of spec)

**File:** `src/lib/sanitize.ts`

- Configure DOMPurify with `ADD_TAGS: ['iframe']`
- `ADD_ATTR` for: srcset, sizes, loading, decoding, target, rel, all aria-* attrs
- Use a `DOMPurify.addHook('uponSanitizeAttribute')` to preserve any attribute matching `/^data-wp-/` -- this covers the full Interactivity API surface (data-wp-interactive, data-wp-context, data-wp-on--click, data-wp-bind--*, data-wp-class--*, data-wp-watch, data-wp-init, data-wp-each, data-wp-text, etc.)
- Block `<script>` tags and inline event handlers (onclick, onerror, etc.) -- DOMPurify's defaults handle this
- Export a `sanitizeGutenbergHtml(html: string): string` function
- Guard against SSR (check `typeof window !== 'undefined'`; if SSR, return the raw HTML or a stripped version)

**File:** `src/lib/normalizeWrapper.ts`

- Parse `assets.wrapper` (e.g. `.wp-gutenberg-content`) into a plain class name by stripping the leading dot
- Default to `wp-gutenberg-content` when wrapper is missing

**Tests:** `src/lib/__tests__/sanitize.test.ts`

- Preserves data-wp-* attributes
- Strips script tags and onclick handlers
- Preserves iframes with safe attributes
- Preserves srcset, loading, decoding

---

## Phase 4: CSS asset loading hook (section 5.3 of spec)

**File:** `src/hooks/useHeadlessAssets.ts`

```tsx
function useHeadlessAssets(cssUrls: string[] | undefined): {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
```

- On mount / when `cssUrls` changes, inject `<link rel="stylesheet">` elements into `document.head`
- Tag each with `data-siter-headless-css="true"` for identification
- Before injecting, check for existing links with matching `href` to avoid duplicates
- Listen for `load`/`error` events to track readiness
- On cleanup, remove only the links this hook instance created
- SSR guard: skip DOM manipulation when `typeof document === 'undefined'`

**Tests:** `src/hooks/__tests__/useHeadlessAssets.test.ts`

---

## Phase 5: GutenbergRenderer component (section 5.1--5.5 of spec)

**File:** `src/components/GutenbergRenderer.tsx`

Core component that composes sanitization + CSS loading:

1. Accept `GutenbergRendererProps`
2. Call `sanitizeGutenbergHtml(html)` (skip if `sanitize === false`)
3. Call `useHeadlessAssets(assets?.css_urls)`
4. Derive className from `normalizeWrapper(assets?.wrapper)` merged with `className` prop
5. Handle asset status per the spec table:
   - `ready` -- render normally
   - `dirty` -- render with stale CSS, call `onAssetStatusChange` and log in dev
   - `generating` -- render with old CSS if available
   - `failed` -- render with old CSS, expose error via `onAssetStatusChange`
   - `missing` -- render HTML without generated CSS (fallback)
6. Render:

```tsx
<div
  className={wrapperClass}
  dangerouslySetInnerHTML={{ __html: cleanHtml }}
  ref={containerRef}
/>
```

7. `containerRef` is forwarded to the interactivity hook (Phase 7)

**Tests:** `src/components/__tests__/GutenbergRenderer.test.tsx`

- Renders sanitized HTML
- Applies wrapper class
- Calls onAssetStatusChange for non-ready statuses

---

## Phase 6: WordPress content fetching (section 5.7 of spec)

**File:** `src/hooks/useWordPressContent.ts`

```tsx
function useWordPressContent(options: {
  wpBaseUrl: string;
  postType: string;
  id?: number;
  slug?: string;
  headless?: boolean;
}): {
  post: WordPressRenderedContent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

- Build URL: `${wpBaseUrl}/wp-json/wp/v2/${postType}/${id}` or `...?slug=${slug}`
- Append `&siter_headless=1` when `headless` is true (default)
- Use `AbortController` for cleanup
- Handle slug responses (WP returns an array, take first element)

**File:** `src/components/WordPressPageRenderer.tsx`

Convenience wrapper that composes `useWordPressContent` + `GutenbergRenderer`:

- Show `loadingFallback` while loading
- Show `errorFallback` on error
- Optionally render `post.title.rendered` based on `showTitle` prop
- Pass content and assets to `GutenbergRenderer`

**Tests:** `src/hooks/__tests__/useWordPressContent.test.ts`, `src/components/__tests__/WordPressPageRenderer.test.tsx`

---

## Phase 7: Interactive blocks (section 5.6 of spec)

**File:** `src/lib/wp-interactive-blocks.ts`

Static map of interactive block names to their script module paths:

```ts
const INTERACTIVE_BLOCK_MAP: Record<string, string> = {
  "core/accordion": "block-library/accordion/view.min.js",
  "core/tabs": "block-library/tabs/view.min.js",
  "core/image": "block-library/image/view.min.js",
  "core/navigation": "block-library/navigation/view.min.js",
  "core/search": "block-library/search/view.min.js",
  "core/file": "block-library/file/view.min.js",
  "core/query": "block-library/query/view.min.js",
  "core/form": "block-library/form/view.min.js",
  "core/playlist": "block-library/playlist/view.min.js",
};
```

Also export a set of blocks that require the interactivity router (`core/query`).

**File:** `src/lib/loadScriptModule.ts`

- `loadScriptModule(url: string): Promise<void>` -- dynamically import or inject a `<script type="module">` tag
- Maintain a `Set<string>` of already-loaded URLs to prevent duplicate loads
- SSR guard

**File:** `src/hooks/useInteractiveBlocks.ts`

```tsx
function useInteractiveBlocks(options: {
  wpBaseUrl: string;
  blocks?: string[];
  containerRef: React.RefObject<HTMLElement>;
  enabled?: boolean;
}): { loaded: boolean; error: string | null }
```

Logic:
1. If `!enabled`, skip
2. Determine needed blocks from `blocks` array, or fallback to scanning `containerRef` for `[data-wp-interactive]` attributes
3. Load interactivity runtime first (`/wp-includes/js/dist/script-modules/interactivity/index.min.js`)
4. If `core/query` is in the set, also load the router module
5. Load each needed block's view script
6. Cache loaded scripts globally to avoid re-importing

**Tests:** `src/hooks/__tests__/useInteractiveBlocks.test.ts`

---

## Phase 8: Barrel export and final wiring

**File:** `src/index.ts` -- export everything per section 7 of the spec:

- Components: `GutenbergRenderer`, `WordPressPageRenderer`
- Hooks: `useWordPressContent`, `useHeadlessAssets`, `useInteractiveBlocks`
- Types: `SiterHeadlessAssets`, `WordPressRenderedContent`, `GutenbergRendererProps`, `WordPressPageRendererProps`

---

## Phase 9: Vite playground

**Directory:** `playground/`

- `playground/index.html`
- `playground/src/main.tsx` -- renders a demo app that uses `WordPressPageRenderer` with configurable wpBaseUrl/postType/id inputs
- `playground/vite.config.ts`
- `playground/tsconfig.json`

The root `dev` script should run the playground via Vite.

---

## Phase 10: CI and publishing

**File:** `.github/workflows/ci.yml` -- as specified in section 9 (checkout, node 22, npm ci, typecheck, test, build)

**File:** `.github/workflows/publish.yml` -- as specified in section 10 (trigger on release, OIDC permissions, npm publish with provenance)

---

## Phase 11: Documentation

**File:** `README.md` -- sections per spec section 11:

- Purpose and positioning ("simplest bridge between WordPress Gutenberg and AI-generated React frontends")
- Installation (`npm install @siter/headless-gutenberg-react`)
- Lovable quick-start example
- Manual usage with `GutenbergRenderer` and `useWordPressContent`
- WordPress REST API requirements and `?siter_headless=1` parameter
- CSS loading explanation
- Interactive block support
- CORS requirements
- Security/sanitization notes
- Publishing instructions

**File:** `CHANGELOG.md` -- initial 0.1.0 entry

---

## Key implementation decisions

- **No block-to-component conversion** -- MVP renders WordPress HTML as-is. This is the core architectural decision.
- **DOMPurify configuration** -- use `addHook` with regex `/^data-wp-/` rather than enumerating every Interactivity API attribute, so new WP attributes work automatically.
- **Script loading** -- use dynamic `import()` for ES module URLs where supported, with `<script type="module">` injection as fallback. Global cache prevents double-loading.
- **SSR safety** -- every hook and utility that touches `document` or `window` checks `typeof window/document !== 'undefined'` before proceeding.
- **Cleanup discipline** -- every DOM side-effect (link injection, script injection) is tracked and cleaned up on unmount via React effect cleanups.
