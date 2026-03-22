import { expect, test } from "@playwright/test";
import { addExpense, claimItemFromSummary, createEvent, joinEvent, uniqueValue } from "./helpers";

test("member can pay after host finalizes the event", async ({ browser, page }) => {
  const { shareToken } = await createEvent(page);
  const itemName = uniqueValue("PW Soda");
  const memberName = uniqueValue("Paying Member");

  await addExpense(page, { name: itemName, price: "120", quantity: "1" });
  await page.getByRole("link", { name: "Review Event" }).click();

  const memberContext = await browser.newContext();
  const memberPage = await memberContext.newPage();
  await joinEvent(memberPage, shareToken, memberName);
  await claimItemFromSummary(memberPage, itemName);

  await page.reload();
  await page.getByRole("link", { name: "Review totals" }).click();
  await page.getByRole("button", { name: "Finalize event" }).click();

  await expect(page.getByText("Finalized")).toBeVisible();

  await memberPage.goto(`/event/${shareToken}/my-summary`);
  await expect(memberPage.getByRole("link", { name: "Pay Now" })).toBeVisible();
  await memberPage.getByRole("link", { name: "Pay Now" }).click();

  await expect(memberPage).toHaveURL(new RegExp(`/event/${shareToken}/payment$`));
  await expect(memberPage.getByRole("heading", { name: "Your payment" })).toBeVisible();
  await expect(memberPage.getByText("Amount due")).toBeVisible();
  await expect(memberPage.getByRole("button", { name: "Mark as paid" })).toBeVisible();

  await memberPage.getByRole("button", { name: "Mark as paid" }).click();
  await expect(memberPage.getByText("Marked paid")).toBeVisible();

  await memberContext.close();
});
