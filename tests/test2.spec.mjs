import { test, expect } from '@playwright/test';

test('test2', async ({ page }) => {
    await page.goto('./tests/On/Traditional.html');
    // wait for 2 seconds
    await page.waitForTimeout(2000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
  });
