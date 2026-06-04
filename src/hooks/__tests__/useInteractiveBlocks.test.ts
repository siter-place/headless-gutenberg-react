import { renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useInteractiveBlocks } from '../useInteractiveBlocks';
import { resetLoadedModules } from '../../lib/loadScriptModule';
import { createRef } from 'react';

describe('useInteractiveBlocks', () => {
  beforeEach(() => {
    resetLoadedModules();
    document.head.innerHTML = '';
  });

  it('does nothing when disabled', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useInteractiveBlocks({
        wpBaseUrl: 'https://example.com',
        containerRef: ref,
        enabled: false,
      })
    );

    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBeNull();
    expect(
      document.head.querySelectorAll('script[type="module"]').length
    ).toBe(0);
  });

  it('marks loaded when no blocks are needed', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useInteractiveBlocks({
        wpBaseUrl: 'https://example.com',
        blocks: [],
        containerRef: ref,
        enabled: true,
      })
    );

    expect(result.current.loaded).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('loads runtime and block scripts when blocks specified', async () => {
    const ref = createRef<HTMLDivElement>();
    renderHook(() =>
      useInteractiveBlocks({
        wpBaseUrl: 'https://example.com',
        blocks: ['core/image'],
        containerRef: ref,
        enabled: true,
      })
    );

    const scripts = document.head.querySelectorAll('script[type="module"]');
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const srcs = Array.from(scripts).map((s) => s.getAttribute('src'));
    expect(srcs).toContain(
      'https://example.com/wp-includes/js/dist/script-modules/interactivity/index.min.js'
    );
  });

  it('loads router when core/query is present', () => {
    const ref = createRef<HTMLDivElement>();
    renderHook(() =>
      useInteractiveBlocks({
        wpBaseUrl: 'https://example.com',
        blocks: ['core/query'],
        containerRef: ref,
        enabled: true,
      })
    );

    const scripts = document.head.querySelectorAll('script[type="module"]');
    const srcs = Array.from(scripts).map((s) => s.getAttribute('src'));

    expect(srcs).toContain(
      'https://example.com/wp-includes/js/dist/script-modules/interactivity/index.min.js'
    );
  });
});
