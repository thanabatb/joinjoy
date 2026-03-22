import { expect, type Page } from "@playwright/test";

export function uniqueValue(prefix: string) {
  return `${prefix} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function createEvent(page: Page, options?: { title?: string; hostName?: string; venueName?: string }) {
  const title = options?.title ?? uniqueValue("PW Event");
  const hostName = options?.hostName ?? uniqueValue("PW Host");
  const venueName = options?.venueName ?? "Playwright Cafe";

  await page.goto("/create");
  await page.locator("#title").fill(title);
  await page.locator("#venue").fill(venueName);
  await page.locator("#hostName").fill(hostName);
  await page.locator("#occurredDate").fill("2026-03-22");
  await page.locator("#occurredTime").fill("20:30");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/event\/[^/]+\/items$/);

  const match = page.url().match(/\/event\/([^/]+)\/items$/);

  if (!match) {
    throw new Error(`Could not extract share token from URL: ${page.url()}`);
  }

  return {
    title,
    hostName,
    venueName,
    shareToken: match[1]
  };
}

export async function addExpense(page: Page, item: { name: string; price: string; quantity?: string }) {
  await page.locator("#item-name-page").fill(item.name);
  await page.locator("#item-price-page").fill(item.price);
  await page.locator("#item-quantity-page").fill(item.quantity ?? "1");
  await page.getByRole("button", { name: "Add to List" }).click();
  await expect(page.getByText(item.name)).toBeVisible();
}

export async function joinEvent(page: Page, shareToken: string, displayName: string) {
  await page.goto(`/event/${shareToken}/summary`);
  await expect(page).toHaveURL(new RegExp(`/event/${shareToken}/join$`));
  await expect(page.locator("#displayName")).toBeVisible();
  await page.locator("#displayName").fill(displayName);
  await page.getByRole("button", { name: "Join now" }).click();
  await expect(page).toHaveURL(new RegExp(`/event/${shareToken}/summary$`));
}

export async function claimItemFromSummary(page: Page, itemName: string) {
  const itemCard = page.locator("article").filter({ hasText: itemName });
  await itemCard.getByRole("button", { name: "Claim" }).click();
  await expect(itemCard.getByRole("button", { name: "Unclaim" })).toBeVisible();
  return itemCard;
}
