import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { WordPressPageRenderer } from '../WordPressPageRenderer';
import type { WordPressRenderedContent } from '../../types/wordpress';

const mockPost: WordPressRenderedContent = {
  id: 1,
  title: { rendered: 'Test Page' },
  content: { rendered: '<p>Content field HTML</p>', protected: false },
  excerpt: { rendered: '<p>Excerpt</p>', protected: false },
  siter_headless: {
    wrapper: '.wp-gutenberg-content',
    status: 'ready',
    is_stale: false,
    css_urls: [],
    blocks: ['core/paragraph'],
    generated_at: '2026-01-01T00:00:00+00:00',
    hash: 'abc123',
    theme: 'twentytwentyfive',
    wp_version: '7.0',
    error_message: null,
    rendered_html: '<p>Rendered HTML from siter_headless</p>',
  },
};

const mockPostNoRenderedHtml: WordPressRenderedContent = {
  ...mockPost,
  siter_headless: {
    ...mockPost.siter_headless,
    rendered_html: undefined,
  },
};

describe('WordPressPageRenderer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading fallback while fetching', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={1}
        loadingFallback={<div data-testid="loading">Loading...</div>}
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('uses rendered_html by default', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer wpBaseUrl="https://example.com" id={1} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('gutenberg-renderer')).toHaveTextContent(
      'Rendered HTML from siter_headless'
    );
  });

  it('falls back to content.rendered when rendered_html is missing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPostNoRenderedHtml), { status: 200 })
    );

    render(
      <WordPressPageRenderer wpBaseUrl="https://example.com" id={1} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('gutenberg-renderer')).toHaveTextContent(
      'Content field HTML'
    );
  });

  it('uses content.rendered when htmlField is content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={1}
        htmlField="content"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    expect(screen.getByTestId('gutenberg-renderer')).toHaveTextContent(
      'Content field HTML'
    );
  });

  it('shows title when showTitle is true', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={1}
        showTitle
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('wordpress-page-title')).toBeInTheDocument();
    });

    expect(screen.getByTestId('wordpress-page-title')).toHaveTextContent(
      'Test Page'
    );
  });

  it('does not show title by default', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer wpBaseUrl="https://example.com" id={1} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('wordpress-page-title')).not.toBeInTheDocument();
  });

  it('shows error fallback on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404, statusText: 'Not Found' })
    );

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={999}
        errorFallback={<div data-testid="error">Error occurred</div>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  it('forwards contentSize and wideSize as CSS custom properties', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={1}
        contentSize="800px"
        wideSize="1200px"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    const renderer = screen.getByTestId('gutenberg-renderer');
    expect(
      renderer.style.getPropertyValue('--wp--style--global--content-size')
    ).toBe('800px');
    expect(
      renderer.style.getPropertyValue('--wp--style--global--wide-size')
    ).toBe('1200px');
  });

  it('forwards wrapperClass and siteBlocksClass', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    render(
      <WordPressPageRenderer
        wpBaseUrl="https://example.com"
        id={1}
        wrapperClass="my-wrapper"
        siteBlocksClass="my-blocks"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('gutenberg-renderer')).toBeInTheDocument();
    });

    const renderer = screen.getByTestId('gutenberg-renderer');
    expect(renderer).toHaveClass('my-wrapper');
    expect(renderer.querySelector('.my-blocks')).toBeTruthy();
  });
});
