import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { WordPressPageRenderer } from '../WordPressPageRenderer';
import type { WordPressRenderedContent } from '../../types/wordpress';

const mockPost: WordPressRenderedContent = {
  id: 1,
  title: { rendered: 'Test Page' },
  content: { rendered: '<p>Page content here</p>', protected: false },
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

  it('renders fetched content', async () => {
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
      'Page content here'
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
});
