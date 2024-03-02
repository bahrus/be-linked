import { test, expect } from '@playwright/test';
test('test1', async ({ page }) => {
    await page.goto('./tests/Link/StandardLinkExample.html');
    // wait for 2 seconds
    await page.waitForTimeout(2000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});

