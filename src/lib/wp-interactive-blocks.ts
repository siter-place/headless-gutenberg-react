export const INTERACTIVE_BLOCK_MAP: Record<string, string> = {
  'core/accordion': 'block-library/accordion/view.min.js',
  'core/tabs': 'block-library/tabs/view.min.js',
  'core/image': 'block-library/image/view.min.js',
  'core/navigation': 'block-library/navigation/view.min.js',
  'core/search': 'block-library/search/view.min.js',
  'core/file': 'block-library/file/view.min.js',
  'core/query': 'block-library/query/view.min.js',
  'core/form': 'block-library/form/view.min.js',
  'core/playlist': 'block-library/playlist/view.min.js',
};

export const BLOCKS_REQUIRING_ROUTER = new Set(['core/query']);

export function getInteractivityRuntimeUrl(wpBaseUrl: string): string {
  const base = wpBaseUrl.replace(/\/+$/, '');
  return `${base}/wp-includes/js/dist/script-modules/interactivity/index.min.js`;
}

export function getInteractivityRouterUrl(wpBaseUrl: string): string {
  const base = wpBaseUrl.replace(/\/+$/, '');
  return `${base}/wp-includes/js/dist/script-modules/interactivity-router/index.min.js`;
}

export function getBlockScriptUrl(
  wpBaseUrl: string,
  blockName: string
): string | null {
  const path = INTERACTIVE_BLOCK_MAP[blockName];
  if (!path) return null;

  const base = wpBaseUrl.replace(/\/+$/, '');
  return `${base}/wp-includes/js/dist/script-modules/${path}`;
}
