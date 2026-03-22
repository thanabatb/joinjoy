import { expect, test } from "@playwright/test";
import { addExpense, claimItemFromSummary, createEvent, joinEvent, uniqueValue } from "./helpers";

test("shared item can be claimed by multiple people and unclaimed back to a single claimer", async ({
  browser,
  page
}) => {
  const { shareToken } = await createEvent(page);
  const itemName = uniqueValue("PW Shared Taco");

  await addExpense(page, { name: itemName, price: "220", quantity: "1" });
  await page.getByRole("link", { name: "Review Event" }).click();

  await claimItemFromSummary(page, itemName);

  const memberContext = await browser.newContext();
  const memberPage = await memberContext.newPage();
  await joinEvent(memberPage, shareToken, uniqueValue("Member"));

  const memberItem = await claimItemFromSummary(memberPage, itemName);
  await expect(memberItem.getByText("Shared by 2 people")).toBeVisible();

  await memberItem.getByRole("button", { name: "Unclaim" }).click();
  await expect(memberItem.getByRole("button", { name: "Claim" })).toBeVisible();
  await expect(memberItem.getByText("CLAIMED")).toBeVisible();

  await page.reload();
  const hostItem = page.locator("article").filter({ hasText: itemName });
  await expect(hostItem.getByText("CLAIMED")).toBeVisible();
  await expect(hostItem.getByRole("button", { name: "Unclaim" })).toBeVisible();
  await expect(hostItem.getByText("Shared by 2 people")).toHaveCount(0);

  await memberContext.close();
});
