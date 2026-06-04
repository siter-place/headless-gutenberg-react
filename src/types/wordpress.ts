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
  wpBaseUrl?: string;
  className?: string;
  enableInteractivity?: boolean;
  sanitize?: boolean;
  loadingFallback?: React.ReactNode;
  onAssetStatusChange?: (status: AssetStatus) => void;
}

export interface WordPressPageRendererProps {
  wpBaseUrl: string;
  postType?: string;
  id?: number;
  slug?: string;
  enableInteractivity?: boolean;
  className?: string;
  showTitle?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}
