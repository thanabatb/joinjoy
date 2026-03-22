import { expect, test } from "@playwright/test";
import { addExpense, claimItemFromSummary, createEvent, joinEvent, uniqueValue } from "./helpers";

test("member can join, share-claim an item, and view personal summary", async ({ browser, page }) => {
  const { shareToken } = await createEvent(page);
  const itemName = uniqueValue("PW Burger");

  await addExpense(page, { name: itemName, price: "300", quantity: "1" });
  await page.getByRole("link", { name: "Review Event" }).click();

  const hostItem = await claimItemFromSummary(page, itemName);
  await expect(hostItem.getByRole("button", { name: "Unclaim" })).toBeVisible();

  const memberContext = await browser.newContext();
  const memberPage = await memberContext.newPage();
  const memberName = uniqueValue("Member");

  await joinEvent(memberPage, shareToken, memberName);

  const memberItem = await claimItemFromSummary(memberPage, itemName);
  await expect(memberItem.getByText("Shared by 2 people")).toBeVisible();

  await memberPage.getByRole("link", { name: "View my summary" }).click();
  await expect(memberPage).toHaveURL(new RegExp(`/event/${shareToken}/my-summary$`));

  const summaryItem = memberPage.locator("article").filter({ hasText: itemName });
  await expect(summaryItem.getByText("Shared")).toBeVisible();
  await expect(summaryItem.locator(".member-summary-avatar")).toHaveCount(2);

  await memberContext.close();
});
