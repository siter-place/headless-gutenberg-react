export type AssetStatus = 'ready' | 'dirty' | 'generating' | 'failed' | 'missing';

export interface SiterHeadlessAssets {
  wrapper: string;
  status: AssetStatus;
  is_stale: boolean;
  css_urls: string[];
  blocks: string[];
  generated_at: string | null;
  hash: string | null;
  theme: string | null;
  wp_version: string | null;
  error_message: string | null;
  rendered_html?: string;
  html_url?: string | null;
}

export interface WordPressRenderedContent {
  id: number;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  siter_headless: SiterHeadlessAssets;
}

export interface GutenbergRendererProps {
  html: string;
  assets?: SiterHeadlessAssets;
  className?: string;
  wrapperClass?: string;
  siteBlocksClass?: string;
  interactivityBasePath?: string;
  sanitize?: boolean;
  /** Override WordPress --wp--style--global--content-size (e.g. '675px') */
  contentSize?: string;
  /** Override WordPress --wp--style--global--wide-size (e.g. '1340px') */
  wideSize?: string;
  loadingFallback?: React.ReactNode;
  onAssetStatusChange?: (status: AssetStatus) => void;
}

export interface WordPressPageRendererProps {
  wpBaseUrl: string;
  postType?: string;
  id?: number;
  slug?: string;
  className?: string;
  wrapperClass?: string;
  siteBlocksClass?: string;
  interactivityBasePath?: string;
  htmlField?: 'rendered_html' | 'content';
  /** Override WordPress --wp--style--global--content-size (e.g. '675px') */
  contentSize?: string;
  /** Override WordPress --wp--style--global--wide-size (e.g. '1340px') */
  wideSize?: string;
  showTitle?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}
