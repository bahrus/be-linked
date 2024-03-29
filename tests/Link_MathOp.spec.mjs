import { test, expect } from '@playwright/test';

test('Link_MathOp', async ({ page }) => {
    await page.goto('./tests/Link/MathOp.html');
    // wait for 12 seconds
    await page.waitForTimeout(2000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
  });
