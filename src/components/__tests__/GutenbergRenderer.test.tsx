import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GutenbergRenderer } from '../GutenbergRenderer';
import type { SiterHeadlessAssets } from '../../types/wordpress';

describe('GutenbergRenderer', () => {
  it('renders HTML content', () => {
    render(<GutenbergRenderer html="<p>Hello world</p>" />);
    const container = screen.getByTestId('gutenberg-renderer');
    expect(container).toHaveTextContent('Hello world');
    expect(container.innerHTML).toBe('<p>Hello world</p>');
  });

  it('applies default wrapper class when no assets', () => {
    render(<GutenbergRenderer html="<p>Test</p>" />);
    expect(screen.getByTestId('gutenberg-renderer')).toHaveClass(
      'wp-gutenberg-content'
    );
  });

  it('applies wrapper class from assets', () => {
    const assets = { wrapper: '.custom-wrapper' } as SiterHeadlessAssets;
    render(<GutenbergRenderer html="<p>Test</p>" assets={assets} />);
    expect(screen.getByTestId('gutenberg-renderer')).toHaveClass('custom-wrapper');
  });

  it('merges className prop with wrapper class', () => {
    render(<GutenbergRenderer html="<p>Test</p>" className="extra" />);
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el).toHaveClass('wp-gutenberg-content');
    expect(el).toHaveClass('extra');
  });

  it('renders complex HTML with data-wp-* attributes', () => {
    const html =
      '<div data-wp-interactive="core/accordion"><button data-wp-on--click="actions.toggle">Toggle</button></div>';
    render(<GutenbergRenderer html={html} />);
    const container = screen.getByTestId('gutenberg-renderer');
    expect(container.querySelector('[data-wp-interactive]')).toBeTruthy();
    expect(container.querySelector('[data-wp-on--click]')).toBeTruthy();
  });
});
