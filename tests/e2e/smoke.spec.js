import { test, expect } from '@playwright/test';

test.describe('Learn to Mouse', () => {
  test('main menu renders with three games and theme buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.title')).toContainText('Learn to Mouse');
    await expect(page.locator('.game-btn')).toHaveCount(3);
    await expect(page.locator('.theme-btn')).toHaveCount(3);
    await expect(page.locator('#mute-btn')).toBeVisible();
  });

  test('launching bubble game shows canvas and score', async ({ page }) => {
    await page.goto('/');
    await page.click('.game-btn[data-game="bubble"]');
    await expect(page.locator('#bubble-game.active')).toBeVisible();
    await expect(page.locator('#bubble-canvas')).toBeVisible();
    await expect(page.locator('#bubble-score')).toHaveText('0');
  });

  test('Escape key returns to main menu from a game', async ({ page }) => {
    await page.goto('/');
    await page.click('.game-btn[data-game="fireworks"]');
    await expect(page.locator('#fireworks-game.active')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#main-menu.active')).toBeVisible();
  });

  test('theme switch updates body class', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-btn[data-theme="boy"]');
    await expect(page.locator('body')).toHaveClass(/theme-boy/);
    await page.click('.theme-btn[data-theme="girl"]');
    await expect(page.locator('body')).toHaveClass(/theme-girl/);
    await page.click('.theme-btn[data-theme="default"]');
    await expect(page.locator('body')).not.toHaveClass(/theme-/);
  });

  test('theme persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-btn[data-theme="boy"]');
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/theme-boy/);
  });

  test('M key toggles mute button state', async ({ page }) => {
    await page.goto('/');
    const muteBtn = page.locator('#mute-btn');
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('m');
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('M');
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('no console errors on initial load and navigation', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.click('.game-btn[data-game="bubble"]');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.click('.game-btn[data-game="feeding"]');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.click('.game-btn[data-game="fireworks"]');
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
