import { describe, expect, it } from 'vitest';
import { normalizeWrapper } from '../normalizeWrapper';

describe('normalizeWrapper', () => {
  it('strips leading dot from CSS class selector', () => {
    expect(normalizeWrapper('.wp-gutenberg-content')).toBe('wp-gutenberg-content');
  });

  it('returns the string as-is when no leading dot', () => {
    expect(normalizeWrapper('custom-wrapper')).toBe('custom-wrapper');
  });

  it('returns default when undefined', () => {
    expect(normalizeWrapper(undefined)).toBe('wp-gutenberg-content');
  });

  it('returns default when empty string', () => {
    expect(normalizeWrapper('')).toBe('wp-gutenberg-content');
  });

  it('returns default when whitespace only', () => {
    expect(normalizeWrapper('   ')).toBe('wp-gutenberg-content');
  });

  it('trims whitespace before processing', () => {
    expect(normalizeWrapper('  .my-class  ')).toBe('my-class');
  });
});
