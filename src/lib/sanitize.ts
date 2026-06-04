import DOMPurify from 'dompurify';

const WP_DATA_ATTR_PATTERN = /^data-wp-/;

function createSanitizer(): (html: string) => string {
  if (typeof window === 'undefined') {
    return (html: string) => html;
  }

  const purify = DOMPurify(window);

  purify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (WP_DATA_ATTR_PATTERN.test(data.attrName)) {
      data.forceKeepAttr = true;
    }
  });

  return (html: string) =>
    purify.sanitize(html, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'srcset',
        'sizes',
        'loading',
        'decoding',
        'target',
        'rel',
        'allow',
        'allowfullscreen',
        'frameborder',
      ],
    });
}

const sanitize = createSanitizer();

export function sanitizeGutenbergHtml(html: string): string {
  return sanitize(html);
}
