import { expect, test } from '@playwright/test';

test('renders the playground and hello world component', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Headless Gutenberg React Playground' })
  ).toBeVisible();
  await expect(page.getByTestId('hello-world')).toHaveText('Hello Siter');
});
