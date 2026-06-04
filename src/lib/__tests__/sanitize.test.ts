import { describe, expect, it } from 'vitest';
import { sanitizeGutenbergHtml } from '../sanitize';

describe('sanitizeGutenbergHtml', () => {
  it('preserves plain paragraph HTML', () => {
    const html = '<p>Hello world</p>';
    expect(sanitizeGutenbergHtml(html)).toBe(html);
  });

  it('strips script tags', () => {
    const html = '<p>Safe</p><script>alert("xss")</script>';
    expect(sanitizeGutenbergHtml(html)).toBe('<p>Safe</p>');
  });

  it('strips inline event handlers', () => {
    const html = '<button onclick="alert(1)">Click</button>';
    const result = sanitizeGutenbergHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).toContain('Click');
  });

  it('strips onerror handlers', () => {
    const html = '<img src="x" onerror="alert(1)">';
    const result = sanitizeGutenbergHtml(html);
    expect(result).not.toContain('onerror');
  });

  it('preserves data-wp-interactive attribute', () => {
    const html = '<div data-wp-interactive="core/accordion">Content</div>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-interactive');
  });

  it('preserves data-wp-context attribute', () => {
    const html =
      '<div data-wp-context=\'{"isOpen":false}\'>Content</div>';
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('data-wp-context');
  });

  it('preserves data-wp-on--click attribute', () => {
    const html = '<button data-wp-on--click="actions.toggle">Toggle</button>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-on--click');
  });

  it('preserves data-wp-bind--* attributes', () => {
    const html = '<div data-wp-bind--aria-expanded="context.isOpen">Text</div>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-bind--aria-expanded');
  });

  it('preserves data-wp-class--* attributes', () => {
    const html = '<div data-wp-class--is-open="context.isOpen">Text</div>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-class--is-open');
  });

  it('preserves data-wp-watch attribute', () => {
    const html = '<div data-wp-watch="callbacks.onToggle">Content</div>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-watch');
  });

  it('preserves data-wp-init attribute', () => {
    const html = '<div data-wp-init="callbacks.init">Content</div>';
    expect(sanitizeGutenbergHtml(html)).toContain('data-wp-init');
  });

  it('preserves iframes with safe attributes', () => {
    const html =
      '<iframe src="https://example.com" allow="autoplay" allowfullscreen frameborder="0"></iframe>';
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('<iframe');
    expect(result).toContain('allow=');
    expect(result).toContain('allowfullscreen');
  });

  it('preserves srcset and sizes attributes on img', () => {
    const html =
      '<img src="photo.jpg" srcset="photo-300.jpg 300w, photo-600.jpg 600w" sizes="(max-width: 600px) 300px, 600px">';
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('srcset');
    expect(result).toContain('sizes');
  });

  it('preserves loading and decoding attributes', () => {
    const html = '<img src="photo.jpg" loading="lazy" decoding="async">';
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('loading="lazy"');
    expect(result).toContain('decoding="async"');
  });

  it('preserves target and rel attributes on links', () => {
    const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener"');
  });

  it('handles complex Gutenberg HTML with multiple data-wp-* attrs', () => {
    const html = `
      <div data-wp-interactive="core/accordion" data-wp-context='{"isOpen":false}'>
        <button data-wp-on--click="actions.toggle">Toggle</button>
        <div data-wp-class--is-open="context.isOpen" data-wp-bind--aria-expanded="context.isOpen">
          <p>Accordion content</p>
        </div>
      </div>
    `;
    const result = sanitizeGutenbergHtml(html);
    expect(result).toContain('data-wp-interactive');
    expect(result).toContain('data-wp-context');
    expect(result).toContain('data-wp-on--click');
    expect(result).toContain('data-wp-class--is-open');
    expect(result).toContain('data-wp-bind--aria-expanded');
    expect(result).not.toContain('<script');
  });
});
