const loadedModules = new Set<string>();

export async function loadScriptModule(url: string): Promise<void> {
  if (typeof document === 'undefined') return;
  if (loadedModules.has(url)) return;

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    script.addEventListener('load', () => {
      loadedModules.add(url);
      resolve();
    });
    script.addEventListener('error', () => {
      reject(new Error(`Failed to load script module: ${url}`));
    });
    document.head.appendChild(script);
  });
}

export function resetLoadedModules(): void {
  loadedModules.clear();
}
