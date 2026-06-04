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

  it('does not load the same URL twice', async () => {
    const p1 = loadScriptModule('https://example.com/once.js');
    const script = document.head.querySelector(
      'script[type="module"]'
    ) as HTMLScriptElement;
    script.dispatchEvent(new Event('load'));
    await p1;

    const countBefore = document.head.querySelectorAll('script[type="module"]').length;
    await loadScriptModule('https://example.com/once.js');
    const countAfter = document.head.querySelectorAll('script[type="module"]').length;

    expect(countAfter).toBe(countBefore);
  });
});
