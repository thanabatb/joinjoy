import { expect, test } from "@playwright/test";
import { addExpense, createEvent, uniqueValue } from "./helpers";

test("host can create an event and add expenses", async ({ page }) => {
  const { title } = await createEvent(page);
  const itemName = uniqueValue("PW Fries");

  await addExpense(page, { name: itemName, price: "180", quantity: "2" });

  await page.getByRole("link", { name: "Review Event" }).click();

  await expect(page).toHaveURL(/\/event\/[^/]+\/summary$/);
  await expect(page.getByRole("heading", { name: "Event Details" })).toBeVisible();
  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bill Items" })).toBeVisible();
  await expect(page.getByText(itemName)).toBeVisible();
});
