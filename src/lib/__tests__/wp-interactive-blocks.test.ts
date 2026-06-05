import { describe, expect, it } from 'vitest';
import {
  SUPPORTED_INTERACTIVE_BLOCKS,
  getInteractivityBundlePath,
} from '../wp-interactive-blocks';

describe('wp-interactive-blocks', () => {
  it('supports expected blocks', () => {
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/accordion')).toBe(true);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/image')).toBe(true);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/gallery')).toBe(true);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/tabs')).toBe(true);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/file')).toBe(true);
  });

  it('excludes complex blocks', () => {
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/query')).toBe(false);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/search')).toBe(false);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/navigation')).toBe(false);
    expect(SUPPORTED_INTERACTIVE_BLOCKS.has('core/form')).toBe(false);
  });

  it('builds interactivity bundle path', () => {
    expect(getInteractivityBundlePath('/interactivity/')).toBe(
      '/interactivity/interactivity.js'
    );
  });

  it('adds trailing slash to basePath', () => {
    expect(getInteractivityBundlePath('/interactivity')).toBe(
      '/interactivity/interactivity.js'
    );
  });
});
