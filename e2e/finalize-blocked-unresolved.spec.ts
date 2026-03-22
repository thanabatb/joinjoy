import { expect, test } from "@playwright/test";
import { addExpense, createEvent, uniqueValue } from "./helpers";

test("host cannot finalize when unresolved items still remain", async ({ page }) => {
  const { shareToken } = await createEvent(page);

  await addExpense(page, { name: uniqueValue("PW Claimed Noodles"), price: "140", quantity: "1" });
  await addExpense(page, { name: uniqueValue("PW Open Dessert"), price: "95", quantity: "1" });

  await page.getByRole("link", { name: "Review Event" }).click();
  await page.getByRole("link", { name: "Review totals" }).click();

  await expect(page).toHaveURL(new RegExp(`/event/${shareToken}/host$`));
  await page.getByRole("button", { name: "Finalize event" }).click();

  await expect(page.getByText("Unresolved items remain. Finalization is blocked.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Host dashboard" })).toBeVisible();
});
