const DEFAULT_WRAPPER = 'wp-gutenberg-content';

export function normalizeWrapper(wrapper: string | undefined): string {
  if (!wrapper) return DEFAULT_WRAPPER;

  const trimmed = wrapper.trim();
  if (!trimmed) return DEFAULT_WRAPPER;

  return trimmed.startsWith('.') ? trimmed.slice(1) : trimmed;
}
