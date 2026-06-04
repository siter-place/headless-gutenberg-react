import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useWordPressContent } from '../useWordPressContent';
import type { WordPressRenderedContent } from '../../types/wordpress';

const mockPost: WordPressRenderedContent = {
  id: 1,
  title: { rendered: 'Hello world!' },
  content: { rendered: '<p>Test content</p>', protected: false },
  excerpt: { rendered: '<p>Excerpt</p>', protected: false },
  siter_headless: {
    wrapper: '.wp-gutenberg-content',
    status: 'ready',
    is_stale: false,
    css_urls: ['https://example.com/style.css'],
    blocks: ['core/paragraph'],
    generated_at: '2026-01-01T00:00:00+00:00',
    hash: 'abc123',
    theme: 'twentytwentyfive',
    wp_version: '7.0',
    error_message: null,
  },
};

describe('useWordPressContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches a post by ID', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    const { result } = renderHook(() =>
      useWordPressContent({ wpBaseUrl: 'https://example.com', id: 1 })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.post).toEqual(mockPost);
    expect(result.current.error).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://example.com/wp-json/wp/v2/posts/1?siter_headless=1',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('fetches a post by slug (array response)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([mockPost]), { status: 200 })
    );

    const { result } = renderHook(() =>
      useWordPressContent({
        wpBaseUrl: 'https://example.com',
        slug: 'hello-world',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.post).toEqual(mockPost);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://example.com/wp-json/wp/v2/posts?slug=hello-world&siter_headless=1',
      expect.anything()
    );
  });

  it('uses custom postType', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    renderHook(() =>
      useWordPressContent({
        wpBaseUrl: 'https://example.com',
        postType: 'pages',
        id: 42,
      })
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://example.com/wp-json/wp/v2/pages/42?siter_headless=1',
        expect.anything()
      );
    });
  });

  it('exposes error on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404, statusText: 'Not Found' })
    );

    const { result } = renderHook(() =>
      useWordPressContent({ wpBaseUrl: 'https://example.com', id: 999 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toContain('404');
    expect(result.current.post).toBeNull();
  });

  it('errors when neither id nor slug provided', async () => {
    const { result } = renderHook(() =>
      useWordPressContent({ wpBaseUrl: 'https://example.com' })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toContain('id or slug');
  });

  it('returns null post for empty slug array response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );

    const { result } = renderHook(() =>
      useWordPressContent({
        wpBaseUrl: 'https://example.com',
        slug: 'nonexistent',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.post).toBeNull();
  });

  it('skips siter_headless param when headless is false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPost), { status: 200 })
    );

    renderHook(() =>
      useWordPressContent({
        wpBaseUrl: 'https://example.com',
        id: 1,
        headless: false,
      })
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://example.com/wp-json/wp/v2/posts/1',
        expect.anything()
      );
    });
  });
});
