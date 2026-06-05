const OVERLAY_CLASS = 'wp-lightbox-overlay';
const STYLE_ID = 'siter-lightbox-css';

const CLOSE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path></svg>';

const PREV_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z"></path></svg>';

const NEXT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z"></path></svg>';

const LIGHTBOX_CSS = `
.wp-lightbox-container {
  position: relative;
  display: flex;
  flex-direction: column;
}
.wp-lightbox-container img {
  cursor: zoom-in;
}
.wp-lightbox-container img:hover + button {
  opacity: 1;
}
.wp-lightbox-container button {
  opacity: 0;
  border: none;
  background-color: rgba(90, 90, 90, 0.25);
  backdrop-filter: blur(16px) saturate(180%);
  cursor: zoom-in;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 100;
  top: 16px;
  left: 16px;
  text-align: center;
  padding: 0;
  border-radius: 4px;
}
@media not (prefers-reduced-motion) {
  .wp-lightbox-container button {
    transition: opacity 0.2s ease;
  }
}
.wp-lightbox-container button:focus-visible {
  outline: 3px auto rgba(90, 90, 90, 0.25);
  outline: 3px auto -webkit-focus-ring-color;
  outline-offset: 3px;
}
.wp-lightbox-container button:hover {
  cursor: pointer;
  opacity: 1;
}
.wp-lightbox-container button:focus {
  opacity: 1;
}
.wp-lightbox-container button:hover,
.wp-lightbox-container button:focus,
.wp-lightbox-container button:not(:hover):not(:active):not(.has-background) {
  background-color: rgba(90, 90, 90, 0.25);
  border: none;
}
.wp-lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  visibility: hidden;
  cursor: zoom-out;
}
.wp-lightbox-overlay .wp-lightbox-close-button {
  font-family: inherit;
  position: absolute;
  top: calc(env(safe-area-inset-top) + 16px);
  left: calc(env(safe-area-inset-left) + 16px);
  padding: 0 4px;
  cursor: pointer;
  z-index: 5000000;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.wp-lightbox-overlay .wp-lightbox-close-button:hover,
.wp-lightbox-overlay .wp-lightbox-close-button:focus,
.wp-lightbox-overlay .wp-lightbox-close-button:not(:hover):not(:active):not(.has-background) {
  background: none;
  border: none;
}
.wp-lightbox-overlay .wp-lightbox-close-button:has(.wp-lightbox-close-text:not([hidden])) .wp-lightbox-close-icon svg {
  height: 1em;
  width: 1em;
}
.wp-lightbox-overlay .wp-lightbox-close-icon svg {
  display: block;
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev,
.wp-lightbox-overlay .wp-lightbox-navigation-button-next {
  position: absolute;
  padding: 0 8px;
  z-index: 2000002;
  font-family: inherit;
  min-width: 40px;
  min-height: 40px;
  gap: 4px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  bottom: 16px;
  line-height: 1;
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev[hidden],
.wp-lightbox-overlay .wp-lightbox-navigation-button-next[hidden] {
  display: none;
}
@media (min-width: 960px) {
  .wp-lightbox-overlay .wp-lightbox-navigation-button-prev,
  .wp-lightbox-overlay .wp-lightbox-navigation-button-next {
    bottom: 50%;
    transform: translateY(-50%);
  }
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev:hover,
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev:focus,
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev:not(:hover):not(:active):not(.has-background),
.wp-lightbox-overlay .wp-lightbox-navigation-button-next:hover,
.wp-lightbox-overlay .wp-lightbox-navigation-button-next:focus,
.wp-lightbox-overlay .wp-lightbox-navigation-button-next:not(:hover):not(:active):not(.has-background) {
  background: none;
  border: none;
  padding: 0 8px;
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev:has(.wp-lightbox-navigation-text:not([hidden])) .wp-lightbox-navigation-icon svg,
.wp-lightbox-overlay .wp-lightbox-navigation-button-next:has(.wp-lightbox-navigation-text:not([hidden])) .wp-lightbox-navigation-icon svg {
  width: 1.5em;
  height: 1.5em;
  display: block;
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-prev {
  right: calc(env(safe-area-inset-right) + 16px);
}
.wp-lightbox-overlay .wp-lightbox-navigation-button-next {
  left: calc(env(safe-area-inset-left) + 16px);
}
.wp-lightbox-overlay .wp-lightbox-navigation-icon svg {
  vertical-align: middle;
}
.wp-lightbox-overlay .lightbox-image-container {
  position: absolute;
  overflow: hidden;
  top: 50%;
  right: 50%;
  transform-origin: top right;
  transform: translate(50%, -50%);
  width: var(--wp--lightbox-container-width);
  height: var(--wp--lightbox-container-height);
  z-index: 2000001;
}
.wp-lightbox-overlay .wp-block-image {
  position: relative;
  transform-origin: 100% 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  z-index: 3000000;
  margin: 0;
}
.wp-lightbox-overlay .wp-block-image img {
  min-width: var(--wp--lightbox-image-width);
  min-height: var(--wp--lightbox-image-height);
  width: var(--wp--lightbox-image-width);
  height: var(--wp--lightbox-image-height);
}
.wp-lightbox-overlay .wp-block-image figcaption {
  display: none;
}
.wp-lightbox-overlay button {
  border: none;
  background: none;
}
.wp-lightbox-overlay .scrim {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2000000;
  background-color: rgb(255, 255, 255);
  opacity: 0.9;
}
.wp-lightbox-overlay.active {
  visibility: visible;
}
.wp-lightbox-overlay .screen-reader-text {
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  word-wrap: normal !important;
}
@media not (prefers-reduced-motion) {
  .wp-lightbox-overlay.active {
    animation: both turn-on-visibility 0.25s;
  }
  .wp-lightbox-overlay.active img {
    animation: both turn-on-visibility 0.35s;
  }
  .wp-lightbox-overlay.show-closing-animation:not(.active) {
    animation: both turn-off-visibility 0.35s;
  }
  .wp-lightbox-overlay.show-closing-animation:not(.active) img {
    animation: both turn-off-visibility 0.25s;
  }
  .wp-lightbox-overlay.zoom.active {
    opacity: 1;
    visibility: visible;
    animation: none;
  }
  .wp-lightbox-overlay.zoom.active .lightbox-image-container {
    animation: lightbox-zoom-in 0.4s;
  }
  .wp-lightbox-overlay.zoom.active .lightbox-image-container img {
    animation: none;
  }
  .wp-lightbox-overlay.zoom.active .scrim {
    animation: turn-on-visibility 0.4s forwards;
  }
  .wp-lightbox-overlay.zoom.show-closing-animation:not(.active) {
    animation: none;
  }
  .wp-lightbox-overlay.zoom.show-closing-animation:not(.active) .lightbox-image-container {
    animation: lightbox-zoom-out 0.4s;
  }
  .wp-lightbox-overlay.zoom.show-closing-animation:not(.active) .lightbox-image-container img {
    animation: none;
  }
  .wp-lightbox-overlay.zoom.show-closing-animation:not(.active) .scrim {
    animation: turn-off-visibility 0.4s forwards;
  }
}
@keyframes turn-on-visibility {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes turn-off-visibility {
  0% { opacity: 1; visibility: visible; }
  99% { opacity: 0; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}
@keyframes lightbox-zoom-in {
  0% {
    transform: translate(calc(-1*((-100vw + var(--wp--lightbox-scrollbar-width)) / 2 + var(--wp--lightbox-initial-left-position))), calc(-50vh + var(--wp--lightbox-initial-top-position))) scale(var(--wp--lightbox-scale));
  }
  100% {
    transform: translate(50%, -50%) scale(1, 1);
  }
}
@keyframes lightbox-zoom-out {
  0% {
    visibility: visible;
    transform: translate(50%, -50%) scale(1, 1);
  }
  99% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
    transform: translate(calc(-1*((-100vw + var(--wp--lightbox-scrollbar-width)) / 2 + var(--wp--lightbox-initial-left-position))), calc(-50vh + var(--wp--lightbox-initial-top-position))) scale(var(--wp--lightbox-scale));
  }
}
`;

function hasLightboxImages(container: HTMLElement): boolean {
  return (
    container.querySelector('[data-wp-interactive="core/image"]') !== null
  );
}

function injectLightboxCss(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = LIGHTBOX_CSS;
  document.head.appendChild(style);
}

function buildOverlayHtml(): string {
  return `<div class="${OVERLAY_CLASS} zoom"
  data-wp-interactive="core/image"
  data-wp-context="{}"
  tabindex="-1"
  data-wp-bind--role="state.roleAttribute"
  data-wp-bind--aria-label="state.ariaLabel"
  data-wp-bind--aria-modal="state.ariaModal"
  data-wp-class--active="state.overlayEnabled"
  data-wp-class--show-closing-animation="state.overlayOpened"
  data-wp-watch---focus="callbacks.setOverlayFocus"
  data-wp-watch---inert="callbacks.setInertElements"
  data-wp-on--keydown="actions.handleKeydown"
  data-wp-on--touchstart="actions.handleTouchStart"
  data-wp-on--touchmove="actions.handleTouchMove"
  data-wp-on--touchend="actions.handleTouchEnd"
  data-wp-on--click="actions.hideLightbox"
  data-wp-on-window--resize="callbacks.setOverlayStyles"
  data-wp-on-window--scroll="actions.handleScroll"
  data-wp-bind--style="state.overlayStyles">

  <button type="button" style="fill:currentColor" class="wp-lightbox-close-button"
    data-wp-bind--aria-label="state.closeButtonAriaLabel">
    <span class="wp-lightbox-close-icon" data-wp-bind--hidden="!state.hasNavigationIcon">${CLOSE_SVG}</span>
    <span class="wp-lightbox-close-text" data-wp-bind--hidden="!state.hasNavigationText">Close</span>
  </button>

  <button type="button" style="fill:currentColor" class="wp-lightbox-navigation-button wp-lightbox-navigation-button-prev"
    data-wp-bind--hidden="!state.hasNavigation"
    data-wp-on--click="actions.showPreviousImage"
    data-wp-bind--aria-label="state.prevButtonAriaLabel">
    <span class="wp-lightbox-navigation-icon" data-wp-bind--hidden="!state.hasNavigationIcon">${PREV_SVG}</span>
    <span class="wp-lightbox-navigation-text" data-wp-bind--hidden="!state.hasNavigationText">Previous</span>
  </button>

  <div class="lightbox-image-container">
    <figure data-wp-bind--class="state.selectedImage.figureClassNames"
            data-wp-bind--style="state.figureStyles">
      <img data-wp-bind--alt="state.selectedImage.alt"
           data-wp-bind--class="state.selectedImage.imgClassNames"
           data-wp-bind--style="state.imgStyles"
           data-wp-bind--src="state.selectedImage.currentSrc">
    </figure>
  </div>

  <div class="lightbox-image-container">
    <figure data-wp-bind--class="state.selectedImage.figureClassNames"
            data-wp-bind--style="state.figureStyles">
      <img data-wp-bind--alt="state.selectedImage.alt"
           data-wp-bind--class="state.selectedImage.imgClassNames"
           data-wp-bind--style="state.imgStyles"
           data-wp-bind--src="state.enlargedSrc"
           data-wp-bind--srcset="state.enlargedSrcset"
           sizes="100vw">
    </figure>
  </div>

  <button type="button" style="fill:currentColor" class="wp-lightbox-navigation-button wp-lightbox-navigation-button-next"
    data-wp-bind--hidden="!state.hasNavigation"
    data-wp-on--click="actions.showNextImage"
    data-wp-bind--aria-label="state.nextButtonAriaLabel">
    <span class="wp-lightbox-navigation-text" data-wp-bind--hidden="!state.hasNavigationText">Next</span>
    <span class="wp-lightbox-navigation-icon" data-wp-bind--hidden="!state.hasNavigationIcon">${NEXT_SVG}</span>
  </button>

  <div data-wp-text="state.ariaLabel" aria-live="polite" aria-atomic="true"
       class="screen-reader-text"></div>

  <div class="scrim" aria-hidden="true"></div>
</div>`;
}

export function injectLightboxOverlay(container: HTMLElement): void {
  if (typeof document === 'undefined') return;
  if (!hasLightboxImages(container)) return;
  if (document.querySelector(`.${OVERLAY_CLASS}`)) return;

  injectLightboxCss();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildOverlayHtml();
  const overlay = wrapper.firstElementChild;
  if (overlay) {
    document.body.appendChild(overlay);
  }
}

export function resetLightboxOverlay(): void {
  const existing = document.querySelector(`.${OVERLAY_CLASS}`);
  if (existing) existing.remove();
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}
