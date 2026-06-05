const SCRIPT_ID = 'wp-script-module-data-@wordpress/interactivity';

interface ImageMetadata {
  uploadedSrc: string;
  figureStyles: string;
  imgStyles: string;
  targetWidth: string;
  targetHeight: string;
  scaleAttr: string;
  galleryId: string | null;
  order: number;
  lightboxSrcset: string;
  navigationButtonType: string;
  customAriaLabel: string;
}

function extractImageMetadata(
  container: HTMLElement
): Record<string, ImageMetadata> {
  const metadata: Record<string, ImageMetadata> = {};
  const imageElements = container.querySelectorAll(
    '[data-wp-interactive="core/image"]'
  );

  for (const el of imageElements) {
    const contextAttr = el.getAttribute('data-wp-context');
    if (!contextAttr) continue;

    let context: { imageId?: string };
    try {
      context = JSON.parse(contextAttr);
    } catch {
      continue;
    }

    if (!context.imageId) continue;

    const img = el.querySelector('img');
    const galleryParent = el.closest(
      '[data-wp-interactive="core/gallery"]'
    );
    let galleryId: string | null = null;
    if (galleryParent) {
      try {
        const galleryCtx = JSON.parse(
          galleryParent.getAttribute('data-wp-context') || '{}'
        );
        galleryId = galleryCtx.galleryId || null;
      } catch {
        // ignore
      }
    }

    metadata[context.imageId] = {
      uploadedSrc: img?.getAttribute('src') || '',
      figureStyles: '',
      imgStyles: '',
      targetWidth: img?.getAttribute('width') || 'none',
      targetHeight: img?.getAttribute('height') || 'none',
      scaleAttr: 'contain',
      galleryId,
      order: Object.keys(metadata).length,
      lightboxSrcset: img?.getAttribute('srcset') || '',
      navigationButtonType: 'icon',
      customAriaLabel: img?.getAttribute('alt') || '',
    };
  }

  return metadata;
}

export function injectServerData(container: HTMLElement): void {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) existing.remove();

  const metadata = extractImageMetadata(container);

  const serverData = {
    state: {
      'core/image': {
        metadata,
      },
    },
    config: {
      'core/image': {
        defaultAriaLabel: 'Enlarged image',
        closeButtonText: 'Close',
        prevButtonText: 'Previous',
        nextButtonText: 'Next',
      },
    },
  };

  const script = document.createElement('script');
  script.type = 'application/json';
  script.id = SCRIPT_ID;
  script.textContent = JSON.stringify(serverData);
  document.head.appendChild(script);
}

export function resetServerData(): void {
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) existing.remove();
}
