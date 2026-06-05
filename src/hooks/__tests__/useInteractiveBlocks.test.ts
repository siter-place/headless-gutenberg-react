import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useInteractiveBlocks } from '../useInteractiveBlocks';
import { resetLoadedModules } from '../../lib/loadScriptModule';
import { resetServerData } from '../../lib/injectServerData';
import { createRef } from 'react';

function fireLoadOnPendingScripts() {
  const scripts = document.head.querySelectorAll('script[type="module"]');
  for (const script of scripts) {
    script.dispatchEvent(new Event('load'));
  }
}

describe('useInteractiveBlocks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetLoadedModules();
    resetServerData();
    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks loaded when no blocks are needed', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useInteractiveBlocks({
        basePath: '/interactivity/',
        blocks: [],
        containerRef: ref,
      })
    );

    expect(result.current.loaded).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('loads the single interactivity bundle for interactive blocks', async () => {
    const ref = createRef<HTMLDivElement>();
    renderHook(() =>
      useInteractiveBlocks({
        basePath: '/interactivity/',
        blocks: ['core/image'],
        containerRef: ref,
      })
    );

    await act(async () => { vi.advanceTimersByTime(10); });

    const moduleScript = document.head.querySelector('script[type="module"]');
    expect(moduleScript).toBeTruthy();
    expect(moduleScript!.getAttribute('src')).toBe(
      '/interactivity/interactivity.js'
    );
  });

  it('loads the same single bundle regardless of which blocks are present', async () => {
    const ref = createRef<HTMLDivElement>();
    renderHook(() =>
      useInteractiveBlocks({
        basePath: '/interactivity/',
        blocks: ['core/accordion', 'core/image', 'core/gallery'],
        containerRef: ref,
      })
    );

    await act(async () => { vi.advanceTimersByTime(10); });
    await act(async () => { fireLoadOnPendingScripts(); });

    const allScripts = document.head.querySelectorAll('script[type="module"]');
    expect(allScripts.length).toBe(1);
    expect(allScripts[0].getAttribute('src')).toBe(
      '/interactivity/interactivity.js'
    );
  });

  it('filters out unsupported blocks and still loads bundle', async () => {
    const ref = createRef<HTMLDivElement>();
    renderHook(() =>
      useInteractiveBlocks({
        basePath: '/interactivity/',
        blocks: ['core/paragraph', 'core/query', 'core/accordion'],
        containerRef: ref,
      })
    );

    await act(async () => { vi.advanceTimersByTime(10); });
    await act(async () => { fireLoadOnPendingScripts(); });

    const allScripts = document.head.querySelectorAll('script[type="module"]');
    expect(allScripts.length).toBe(1);
    expect(allScripts[0].getAttribute('src')).toBe(
      '/interactivity/interactivity.js'
    );
  });

  it('does not load bundle when only unsupported blocks present', async () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() =>
      useInteractiveBlocks({
        basePath: '/interactivity/',
        blocks: ['core/paragraph', 'core/query'],
        containerRef: ref,
      })
    );

    await act(async () => { vi.advanceTimersByTime(10); });

    const allScripts = document.head.querySelectorAll('script[type="module"]');
    expect(allScripts.length).toBe(0);
    expect(result.current.loaded).toBe(true);
  });
});
