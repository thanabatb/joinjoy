import { expect, test } from "@playwright/test";
import { addExpense, claimItemFromSummary, createEvent, joinEvent, uniqueValue } from "./helpers";

test("host can review totals after members claim items", async ({ browser, page }) => {
  const hostName = uniqueValue("Host");
  const { shareToken } = await createEvent(page, { hostName });
  const itemName = uniqueValue("PW Pasta");
  const memberName = uniqueValue("Member");

  await addExpense(page, { name: itemName, price: "240", quantity: "1" });
  await page.getByRole("link", { name: "Review Event" }).click();

  const memberContext = await browser.newContext();
  const memberPage = await memberContext.newPage();
  await joinEvent(memberPage, shareToken, memberName);
  await claimItemFromSummary(memberPage, itemName);

  await page.reload();
  await page.getByRole("link", { name: "Review totals" }).click();

  await expect(page).toHaveURL(new RegExp(`/event/${shareToken}/host$`));
  await expect(page.getByRole("heading", { name: "Host dashboard" })).toBeVisible();
  await expect(page.getByText(memberName)).toBeVisible();
  await expect(page.getByText(hostName)).toBeVisible();
  await expect(page.getByRole("button", { name: "Finalize event" })).toBeVisible();

  await memberContext.close();
});
