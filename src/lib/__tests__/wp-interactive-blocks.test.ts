import { describe, expect, it } from 'vitest';
import {
  INTERACTIVE_BLOCK_MAP,
  BLOCKS_REQUIRING_ROUTER,
  getInteractivityRuntimeUrl,
  getInteractivityRouterUrl,
  getBlockScriptUrl,
} from '../wp-interactive-blocks';

describe('wp-interactive-blocks', () => {
  it('maps known blocks to script paths', () => {
    expect(INTERACTIVE_BLOCK_MAP['core/accordion']).toBe(
      'block-library/accordion/view.min.js'
    );
    expect(INTERACTIVE_BLOCK_MAP['core/query']).toBe(
      'block-library/query/view.min.js'
    );
  });

  it('identifies blocks requiring router', () => {
    expect(BLOCKS_REQUIRING_ROUTER.has('core/query')).toBe(true);
    expect(BLOCKS_REQUIRING_ROUTER.has('core/accordion')).toBe(false);
  });

  it('builds runtime URL', () => {
    expect(getInteractivityRuntimeUrl('https://example.com')).toBe(
      'https://example.com/wp-includes/js/dist/script-modules/interactivity/index.min.js'
    );
  });

  it('builds runtime URL stripping trailing slash', () => {
    expect(getInteractivityRuntimeUrl('https://example.com/')).toBe(
      'https://example.com/wp-includes/js/dist/script-modules/interactivity/index.min.js'
    );
  });

  it('builds router URL', () => {
    expect(getInteractivityRouterUrl('https://example.com')).toBe(
      'https://example.com/wp-includes/js/dist/script-modules/interactivity-router/index.min.js'
    );
  });

  it('builds block script URL for known block', () => {
    expect(getBlockScriptUrl('https://example.com', 'core/image')).toBe(
      'https://example.com/wp-includes/js/dist/script-modules/block-library/image/view.min.js'
    );
  });

  it('returns null for unknown block', () => {
    expect(getBlockScriptUrl('https://example.com', 'core/unknown')).toBeNull();
  });
});
