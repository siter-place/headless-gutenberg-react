const loadedModules = new Set<string>();

export async function loadScriptModule(url: string): Promise<void> {
  if (typeof document === 'undefined') return;

  const isReload = loadedModules.has(url);

  if (isReload) {
    const existing = document.head.querySelectorAll(
      `script[type="module"][src^="${url}"]`
    );
    existing.forEach((s) => s.remove());
  }

  const loadUrl = isReload ? `${url}?v=${Date.now()}` : url;

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = loadUrl;
    script.addEventListener('load', () => {
      loadedModules.add(url);
      resolve();
    });
    script.addEventListener('error', () => {
      reject(new Error(`Failed to load script module: ${loadUrl}`));
    });
    document.head.appendChild(script);
  });
}

export function resetLoadedModules(): void {
  loadedModules.clear();
}
