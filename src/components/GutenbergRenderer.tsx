import { normalizeWrapper } from '../lib/normalizeWrapper';
import { sanitizeGutenbergHtml } from '../lib/sanitize';
import type { GutenbergRendererProps } from '../types/wordpress';

export function GutenbergRenderer({
  html,
  assets,
  className,
  sanitize = true,
}: GutenbergRendererProps) {
  const wrapperClass = normalizeWrapper(assets?.wrapper);
  const combinedClass = className ? `${wrapperClass} ${className}` : wrapperClass;
  const cleanHtml = sanitize ? sanitizeGutenbergHtml(html) : html;

  return (
    <div
      className={combinedClass}
      data-testid="gutenberg-renderer"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
