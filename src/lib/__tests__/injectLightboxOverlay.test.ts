import { describe, expect, it, beforeEach } from 'vitest';
import {
  injectLightboxOverlay,
  resetLightboxOverlay,
} from '../injectLightboxOverlay';

function createContainerWithImages(): HTMLDivElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <figure class="wp-block-image wp-lightbox-container"
      data-wp-interactive="core/image"
      data-wp-context='{"imageId":"abc123"}'>
      <img src="https://example.com/photo.jpg" alt="Test" width="800" height="600" />
    </figure>
  `;
  document.body.appendChild(container);
  return container;
}

function createContainerWithoutImages(): HTMLDivElement {
  const container = document.createElement('div');
  container.innerHTML = '<p>No images here</p>';
  document.body.appendChild(container);
  return container;
}

describe('injectLightboxOverlay', () => {
  beforeEach(() => {
    resetLightboxOverlay();
    document.body.innerHTML = '';
  });

  it('injects overlay when lightbox images are detected', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    const overlay = document.querySelector('.wp-lightbox-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay!.getAttribute('data-wp-interactive')).toBe('core/image');
  });

  it('does not inject overlay when no lightbox images exist', () => {
    const container = createContainerWithoutImages();
    injectLightboxOverlay(container);

    expect(document.querySelector('.wp-lightbox-overlay')).toBeNull();
  });

  it('is idempotent (only injects once)', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);
    injectLightboxOverlay(container);

    const overlays = document.querySelectorAll('.wp-lightbox-overlay');
    expect(overlays.length).toBe(1);
  });

  it('includes close button', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    const closeBtn = document.querySelector('.wp-lightbox-close-button');
    expect(closeBtn).toBeTruthy();
  });

  it('includes navigation buttons', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    expect(
      document.querySelector('.wp-lightbox-navigation-button-prev')
    ).toBeTruthy();
    expect(
      document.querySelector('.wp-lightbox-navigation-button-next')
    ).toBeTruthy();
  });

  it('includes two lightbox image containers', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    const containers = document.querySelectorAll('.lightbox-image-container');
    expect(containers.length).toBe(2);
  });

  it('includes scrim backdrop', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    expect(document.querySelector('.scrim')).toBeTruthy();
  });

  it('appends overlay to document.body', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    const overlay = document.querySelector('.wp-lightbox-overlay');
    expect(overlay!.parentElement).toBe(document.body);
  });

  it('resetLightboxOverlay removes the overlay', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);
    expect(document.querySelector('.wp-lightbox-overlay')).toBeTruthy();

    resetLightboxOverlay();
    expect(document.querySelector('.wp-lightbox-overlay')).toBeNull();
  });

  it('can inject again after reset', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);
    resetLightboxOverlay();
    injectLightboxOverlay(container);

    expect(document.querySelector('.wp-lightbox-overlay')).toBeTruthy();
  });

  it('injects lightbox CSS into document head', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);

    const style = document.getElementById('siter-lightbox-css');
    expect(style).toBeTruthy();
    expect(style!.tagName).toBe('STYLE');
    expect(style!.textContent).toContain('.wp-lightbox-overlay');
    expect(style!.textContent).toContain('.wp-lightbox-overlay.active');
    expect(style!.textContent).toContain('visibility: visible');
  });

  it('does not inject CSS when no lightbox images', () => {
    const container = createContainerWithoutImages();
    injectLightboxOverlay(container);

    expect(document.getElementById('siter-lightbox-css')).toBeNull();
  });

  it('resetLightboxOverlay removes CSS', () => {
    const container = createContainerWithImages();
    injectLightboxOverlay(container);
    expect(document.getElementById('siter-lightbox-css')).toBeTruthy();

    resetLightboxOverlay();
    expect(document.getElementById('siter-lightbox-css')).toBeNull();
  });
});
