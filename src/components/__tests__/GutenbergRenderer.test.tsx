import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GutenbergRenderer } from '../GutenbergRenderer';
import type { SiterHeadlessAssets } from '../../types/wordpress';

describe('GutenbergRenderer', () => {
  it('renders HTML content inside wp-site-blocks', () => {
    render(<GutenbergRenderer html="<p>Hello world</p>" />);
    const container = screen.getByTestId('gutenberg-renderer');
    expect(container).toHaveTextContent('Hello world');

    const inner = container.querySelector('.wp-site-blocks');
    expect(inner).toBeTruthy();
    expect(inner!.innerHTML).toBe('<p>Hello world</p>');
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

  it('uses wrapperClass prop over assets.wrapper', () => {
    const assets = { wrapper: '.from-assets' } as SiterHeadlessAssets;
    render(
      <GutenbergRenderer
        html="<p>Test</p>"
        assets={assets}
        wrapperClass="override-wrapper"
      />
    );
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el).toHaveClass('override-wrapper');
    expect(el).not.toHaveClass('from-assets');
  });

  it('uses custom siteBlocksClass', () => {
    render(
      <GutenbergRenderer
        html="<p>Test</p>"
        siteBlocksClass="custom-blocks"
      />
    );
    const container = screen.getByTestId('gutenberg-renderer');
    expect(container.querySelector('.custom-blocks')).toBeTruthy();
    expect(container.querySelector('.wp-site-blocks')).toBeNull();
  });

  it('renders default wp-site-blocks class on inner div', () => {
    render(<GutenbergRenderer html="<p>Test</p>" />);
    const container = screen.getByTestId('gutenberg-renderer');
    expect(container.querySelector('.wp-site-blocks')).toBeTruthy();
  });

  it('applies contentSize as CSS custom property', () => {
    render(<GutenbergRenderer html="<p>Test</p>" contentSize="800px" />);
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el.style.getPropertyValue('--wp--style--global--content-size')).toBe(
      '800px'
    );
  });

  it('applies wideSize as CSS custom property', () => {
    render(<GutenbergRenderer html="<p>Test</p>" wideSize="1200px" />);
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el.style.getPropertyValue('--wp--style--global--wide-size')).toBe(
      '1200px'
    );
  });

  it('applies both contentSize and wideSize together', () => {
    render(
      <GutenbergRenderer
        html="<p>Test</p>"
        contentSize="700px"
        wideSize="1400px"
      />
    );
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el.style.getPropertyValue('--wp--style--global--content-size')).toBe(
      '700px'
    );
    expect(el.style.getPropertyValue('--wp--style--global--wide-size')).toBe(
      '1400px'
    );
  });

  it('does not set layout style when neither contentSize nor wideSize provided', () => {
    render(<GutenbergRenderer html="<p>Test</p>" />);
    const el = screen.getByTestId('gutenberg-renderer');
    expect(el.getAttribute('style')).toBeNull();
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
