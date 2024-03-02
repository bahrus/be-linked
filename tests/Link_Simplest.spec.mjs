import { test, expect } from '@playwright/test';
test('Link_Simplest', async ({ page }) => {
    await page.goto('./tests/Link/Simplest.html');
    // wait for 2 seconds
    await page.waitForTimeout(2000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});

