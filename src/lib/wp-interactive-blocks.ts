const INTERACTIVE_BLOCK_NAMES = [
  'core/image',
  'core/gallery',
  'core/accordion',
  'core/tabs',
  'core/file',
];

export const SUPPORTED_INTERACTIVE_BLOCKS = new Set(INTERACTIVE_BLOCK_NAMES);

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function getInteractivityBundlePath(basePath: string): string {
  return `${ensureTrailingSlash(basePath)}interactivity.js`;
}
