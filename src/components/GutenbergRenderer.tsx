import { useRef, useLayoutEffect } from 'react';
import { normalizeWrapper } from '../lib/normalizeWrapper';
import { sanitizeGutenbergHtml } from '../lib/sanitize';
import { useInteractiveBlocks } from '../hooks/useInteractiveBlocks';
import type { GutenbergRendererProps } from '../types/wordpress';

const DEFAULT_SITE_BLOCKS_CLASS = 'wp-site-blocks';
const DEFAULT_INTERACTIVITY_BASE_PATH = '/interactivity/';

export function GutenbergRenderer({
  html,
  assets,
  className,
  wrapperClass: wrapperClassProp,
  siteBlocksClass = DEFAULT_SITE_BLOCKS_CLASS,
  interactivityBasePath = DEFAULT_INTERACTIVITY_BASE_PATH,
  sanitize = true,
  contentSize,
  wideSize,
}: GutenbergRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const renderedHtmlRef = useRef<string | null>(null);

  const resolvedWrapper = wrapperClassProp ?? normalizeWrapper(assets?.wrapper);
  const outerClass = className
    ? `${resolvedWrapper} ${className}`
    : resolvedWrapper;
  const cleanHtml = sanitize ? sanitizeGutenbergHtml(html) : html;

  const layoutStyle: React.CSSProperties | undefined =
    contentSize || wideSize
      ? ({
          ...(contentSize && { '--wp--style--global--content-size': contentSize }),
          ...(wideSize && { '--wp--style--global--wide-size': wideSize }),
        } as React.CSSProperties)
      : undefined;

  useLayoutEffect(() => {
    if (innerRef.current && cleanHtml !== renderedHtmlRef.current) {
      innerRef.current.innerHTML = cleanHtml;
      renderedHtmlRef.current = cleanHtml;
    }
  }, [cleanHtml]);

  useInteractiveBlocks({
    basePath: interactivityBasePath,
    blocks: assets?.blocks,
    containerRef,
  });

  return (
    <div className={outerClass} style={layoutStyle} data-testid="gutenberg-renderer" ref={containerRef}>
      <div className={siteBlocksClass} ref={innerRef} />
    </div>
  );
}
