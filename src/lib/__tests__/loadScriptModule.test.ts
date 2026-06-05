import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { loadScriptModule, resetLoadedModules } from '../loadScriptModule';

describe('loadScriptModule', () => {
  beforeEach(() => {
    resetLoadedModules();
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('injects a script[type=module] into document.head', async () => {
    const promise = loadScriptModule('https://example.com/module.js');

    const script = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.src).toBe('https://example.com/module.js');

    script.dispatchEvent(new Event('load'));
    await promise;
  });

  it('resolves on load event', async () => {
    const promise = loadScriptModule('https://example.com/a.js');
    const script = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;

    script.dispatchEvent(new Event('load'));
    await expect(promise).resolves.toBeUndefined();
  });

  it('rejects on error event', async () => {
    const promise = loadScriptModule('https://example.com/bad.js');
    const script = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;

    script.dispatchEvent(new Event('error'));
    await expect(promise).rejects.toThrow('Failed to load script module');
  });

  it('auto-reloads with cache-busting when URL was previously loaded', async () => {
    const url = 'https://example.com/interactivity.js';
    const p1 = loadScriptModule(url);
    const script1 = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;
    expect(script1.src).toBe(url);
    script1.dispatchEvent(new Event('load'));
    await p1;

    const p2 = loadScriptModule(url);
    const scripts = document.head.querySelectorAll('script[type="module"]');
    const script2 = scripts[scripts.length - 1] as HTMLScriptElement;
    expect(script2.src).toContain(url);
    expect(script2.src).toContain('?v=');

    script2.dispatchEvent(new Event('load'));
    await p2;
  });

  it('removes old script tags on reload', async () => {
    const url = 'https://example.com/bundle.js';
    const p1 = loadScriptModule(url);
    const script1 = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;
    script1.dispatchEvent(new Event('load'));
    await p1;

    expect(document.head.querySelectorAll('script[type="module"]').length).toBe(1);

    const p2 = loadScriptModule(url);
    const allScripts = document.head.querySelectorAll('script[type="module"]');
    expect(allScripts.length).toBe(1);
    const script2 = allScripts[0] as HTMLScriptElement;
    expect(script2.src).toContain('?v=');

    script2.dispatchEvent(new Event('load'));
    await p2;
  });
});
