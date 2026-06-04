import { expect, test } from '@playwright/test';

test('loads WordPress content via proxy', async ({ page }) => {
  test.skip(!!process.env.CI, 'Requires local WordPress instance');

  await page.goto('/');

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
  await expect(renderer).toContainText('Welcome to WordPress');
  await expect(renderer).toHaveClass(/wp-gutenberg-content/);
});
