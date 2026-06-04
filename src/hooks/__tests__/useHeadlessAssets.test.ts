import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { useHeadlessAssets } from '../useHeadlessAssets';

describe('useHeadlessAssets', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('returns loaded:true when no CSS URLs provided', () => {
    const { result } = renderHook(() => useHeadlessAssets(undefined));
    expect(result.current.loaded).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns loaded:true when empty array provided', () => {
    const { result } = renderHook(() => useHeadlessAssets([]));
    expect(result.current.loaded).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('injects link elements into document.head', () => {
    const urls = ['https://example.com/style1.css', 'https://example.com/style2.css'];
    renderHook(() => useHeadlessAssets(urls));

    const links = document.head.querySelectorAll('link[data-siter-headless-css]');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe(urls[0]);
    expect(links[1].getAttribute('href')).toBe(urls[1]);
    expect(links[0].getAttribute('rel')).toBe('stylesheet');
  });

  it('does not inject duplicate links for the same URL', () => {
    const urls = ['https://example.com/style.css'];

    const { rerender } = renderHook(
      ({ cssUrls }) => useHeadlessAssets(cssUrls),
      { initialProps: { cssUrls: urls } }
    );

    const countBefore = document.head.querySelectorAll(
      'link[data-siter-headless-css]'
    ).length;

    rerender({ cssUrls: urls });

    const countAfter = document.head.querySelectorAll(
      'link[data-siter-headless-css]'
    ).length;
    expect(countAfter).toBe(countBefore);
  });

  it('sets loading state while CSS is loading', () => {
    const urls = ['https://example.com/style.css'];
    const { result } = renderHook(() => useHeadlessAssets(urls));
    expect(result.current.loading).toBe(true);
    expect(result.current.loaded).toBe(false);
  });

  it('sets loaded:true when link fires load event', () => {
    const urls = ['https://example.com/style.css'];
    const { result } = renderHook(() => useHeadlessAssets(urls));

    const link = document.head.querySelector('link[data-siter-headless-css]')!;
    act(() => {
      link.dispatchEvent(new Event('load'));
    });

    expect(result.current.loaded).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error when link fires error event', () => {
    const urls = ['https://example.com/bad.css'];
    const { result } = renderHook(() => useHeadlessAssets(urls));

    const link = document.head.querySelector('link[data-siter-headless-css]')!;
    act(() => {
      link.dispatchEvent(new Event('error'));
    });

    expect(result.current.loaded).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toContain('bad.css');
  });

  it('removes injected links on unmount', () => {
    const urls = ['https://example.com/style.css'];
    const { unmount } = renderHook(() => useHeadlessAssets(urls));

    expect(
      document.head.querySelectorAll('link[data-siter-headless-css]').length
    ).toBe(1);

    unmount();

    expect(
      document.head.querySelectorAll('link[data-siter-headless-css]').length
    ).toBe(0);
  });
});
