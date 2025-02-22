/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, Page, test } from '@playwright/test';
import {
  enterPlaygroundRoom,
  focusRichText,
  initEmptyState,
  pressEnter,
  selectAllByKeyboard,
  withCtrlOrMeta,
} from './utils/actions';

const pressCreateLinkShortCut = async (page: Page) => {
  await withCtrlOrMeta(page, async () => {
    await page.keyboard.press('k');
    await page.keyboard.up('k');
  });
};

test('basic link', async ({ page }) => {
  const linkText = 'linkText';
  const link = 'http://example.com';
  await enterPlaygroundRoom(page);
  await initEmptyState(page);
  await focusRichText(page);
  await page.keyboard.type(linkText);

  // Create link
  await selectAllByKeyboard(page);
  await pressCreateLinkShortCut(page);

  const linkPopoverLocator = page.locator('.overlay-container');
  expect(await linkPopoverLocator.isVisible()).toBe(true);
  const linkPopoverInput = page.locator('.affine-link-popover-input');
  expect(await linkPopoverInput.isVisible()).toBe(true);
  await linkPopoverInput.fill(link);
  // await page.keyboard.type(link);
  // await page.locator(`text="Confirm"`).click();
  await pressEnter(page);
  expect(await linkPopoverLocator.isVisible()).toBe(false);

  const linkLocator = page.locator(`text="${linkText}"`);
  await expect(linkLocator).toHaveAttribute('href', link);

  // Hover link
  expect(await linkPopoverLocator.isVisible()).toBe(false);
  await linkLocator.hover();
  // wait for popover delay open
  await page.waitForTimeout(200);
  expect(await linkPopoverLocator.isVisible()).toBe(true);

  // Edit link
  const text2 = 'link2';
  const link2 = 'https://github.com';
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await pressEnter(page);

  const editLinkPopoverLocator = page.locator('.affine-link-edit-popover');
  expect(await editLinkPopoverLocator.isVisible()).toBe(true);
  await page.keyboard.press('Tab');
  await page.keyboard.type(text2);
  await page.keyboard.press('Tab');
  await page.keyboard.type(link2);
  await page.keyboard.press('Tab');
  await pressEnter(page);
  const link2Locator = page.locator(`text="${text2}"`);

  await expect(link2Locator).toHaveAttribute('href', link2);
});
