import { GutenbergRenderer } from './GutenbergRenderer';
import { useWordPressContent } from '../hooks/useWordPressContent';
import { useHeadlessAssets } from '../hooks/useHeadlessAssets';
import type { WordPressPageRendererProps } from '../types/wordpress';

function resolveHtml(
  post: { content: { rendered: string }; siter_headless?: { rendered_html?: string } },
  htmlField: 'rendered_html' | 'content'
): string {
  if (htmlField === 'content') {
    return post.content.rendered;
  }
  return post.siter_headless?.rendered_html ?? post.content.rendered;
}

export function WordPressPageRenderer({
  wpBaseUrl,
  postType = 'posts',
  id,
  slug,
  className,
  wrapperClass,
  siteBlocksClass,
  interactivityBasePath,
  htmlField = 'rendered_html',
  contentSize,
  wideSize,
  showTitle = false,
  loadingFallback = null,
  errorFallback = null,
}: WordPressPageRendererProps) {
  const { post, loading, error } = useWordPressContent({
    wpBaseUrl,
    postType,
    id,
    slug,
  });

  useHeadlessAssets(post?.siter_headless?.css_urls);

  if (loading) return <>{loadingFallback}</>;
  if (error || !post) return <>{errorFallback}</>;

  const html = resolveHtml(post, htmlField);

  return (
    <div data-testid="wordpress-page-renderer">
      {showTitle && post.title?.rendered && (
        <h1
          data-testid="wordpress-page-title"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      )}
      <GutenbergRenderer
        html={html}
        assets={post.siter_headless}
        className={className}
        wrapperClass={wrapperClass}
        siteBlocksClass={siteBlocksClass}
        interactivityBasePath={interactivityBasePath}
        contentSize={contentSize}
        wideSize={wideSize}
      />
    </div>
  );
}
