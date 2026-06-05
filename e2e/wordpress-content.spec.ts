import { expect, test, type Page } from '@playwright/test';

async function waitForInteractivityHydration(page: Page) {
  await page.waitForFunction(
    () => {
      const btn = document.querySelector(
        '.wp-block-accordion-heading button'
      );
      return btn && 'l' in btn;
    },
    { timeout: 15_000 }
  );
}

test.describe('WordPress content rendering', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!!process.env.CI, 'Requires local WordPress instance');
    await page.goto('/');
  });

  test('loads and renders WordPress content', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'WordPress REST Test' })
    ).toBeVisible();

    await page.getByTestId('wp-load-button').click();
    await expect(page.getByTestId('wp-loading')).toBeVisible();

    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByTestId('wordpress-page-title')).toHaveText(
      'Hello world!'
    );

    const renderer = page.getByTestId('gutenberg-renderer');
    await expect(renderer).not.toBeEmpty();
    await expect(renderer).toHaveClass(/wp-gutenberg-content/);

    const inner = renderer.locator('.wp-site-blocks');
    await expect(inner).toBeVisible();
  });

  test('accordion expands and collapses on click', async ({ page }) => {
    await page.getByTestId('wp-load-button').click();
    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await waitForInteractivityHydration(page);

    const accordionHeading = page
      .locator('.wp-block-accordion-heading button')
      .first();
    await expect(accordionHeading).toBeVisible();
    await expect(accordionHeading).toHaveAttribute('aria-expanded', 'false');

    await accordionHeading.click();

    await expect(accordionHeading).toHaveAttribute('aria-expanded', 'true', {
      timeout: 5_000,
    });

    const panel = page.locator('.wp-block-accordion-panel').first();
    await expect(panel).not.toHaveAttribute('inert', '', { timeout: 5_000 });

    await accordionHeading.click();
    await expect(accordionHeading).toHaveAttribute('aria-expanded', 'false', {
      timeout: 5_000,
    });
  });

  test('gallery image opens lightbox on click', async ({ page }) => {
    await page.getByTestId('wp-load-button').click();
    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await waitForInteractivityHydration(page);

    const lightboxImage = page
      .locator('.wp-lightbox-container img[data-wp-on--click]')
      .first();
    await expect(lightboxImage).toBeVisible({ timeout: 10_000 });

    await lightboxImage.click();

    const lightboxOverlay = page.locator('.wp-lightbox-overlay.active');
    await expect(lightboxOverlay).toBeVisible({ timeout: 5_000 });

    const closeButton = page.locator('.wp-lightbox-close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(lightboxOverlay).not.toBeVisible({ timeout: 5_000 });
  });

  test('interactivity works after content re-render (post 1 → 2 → 1)', async ({ page }) => {
    await page.getByTestId('wp-load-button').click();
    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await waitForInteractivityHydration(page);

    const accordion1 = page
      .locator('.wp-block-accordion-heading button')
      .first();
    await expect(accordion1).toBeVisible();
    await accordion1.click();
    await expect(accordion1).toHaveAttribute('aria-expanded', 'true', {
      timeout: 5_000,
    });
    await accordion1.click();
    await expect(accordion1).toHaveAttribute('aria-expanded', 'false', {
      timeout: 5_000,
    });

    const postIdInput = page.getByTestId('wp-post-id-input');
    await postIdInput.fill('2');

    await page.waitForTimeout(2_000);

    await postIdInput.fill('1');

    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await waitForInteractivityHydration(page);

    const accordion2 = page
      .locator('.wp-block-accordion-heading button')
      .first();
    await expect(accordion2).toBeVisible({ timeout: 10_000 });
    await accordion2.click();
    await expect(accordion2).toHaveAttribute('aria-expanded', 'true', {
      timeout: 5_000,
    });
  });

  test('interactivity scripts are loaded and hydrate the DOM', async ({
    page,
  }) => {
    await page.getByTestId('wp-load-button').click();
    await expect(page.getByTestId('gutenberg-renderer')).toBeVisible({
      timeout: 10_000,
    });

    await waitForInteractivityHydration(page);

    const hydrationState = await page.evaluate(() => {
      const moduleScript = document.querySelector(
        'script[type="module"][src*="interactivity"]'
      );
      const serverData = document.getElementById(
        'wp-script-module-data-@wordpress/interactivity'
      );
      const accordionBtn = document.querySelector(
        '.wp-block-accordion-heading button'
      );

      return {
        bundleLoaded: !!moduleScript,
        serverDataInjected: !!serverData,
        accordionHydrated: accordionBtn ? 'l' in accordionBtn : false,
      };
    });

    expect(hydrationState.bundleLoaded).toBe(true);
    expect(hydrationState.serverDataInjected).toBe(true);
    expect(hydrationState.accordionHydrated).toBe(true);
  });
});
