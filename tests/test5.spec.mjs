import { test, expect } from '@playwright/test';

test('test5', async ({ page }) => {
    await page.goto('./tests/On/ScriptExampleUpstream.html');
    // wait for 12 seconds
    await page.waitForTimeout(12000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
  });
