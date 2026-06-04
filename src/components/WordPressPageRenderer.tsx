import { GutenbergRenderer } from './GutenbergRenderer';
import { useWordPressContent } from '../hooks/useWordPressContent';
import { useHeadlessAssets } from '../hooks/useHeadlessAssets';
import type { WordPressPageRendererProps } from '../types/wordpress';

export function WordPressPageRenderer({
  wpBaseUrl,
  postType = 'posts',
  id,
  slug,
  enableInteractivity,
  className,
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

  return (
    <div data-testid="wordpress-page-renderer">
      {showTitle && post.title?.rendered && (
        <h1
          data-testid="wordpress-page-title"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      )}
      <GutenbergRenderer
        html={post.content.rendered}
        assets={post.siter_headless}
        wpBaseUrl={wpBaseUrl}
        className={className}
        enableInteractivity={enableInteractivity}
      />
    </div>
  );
}
