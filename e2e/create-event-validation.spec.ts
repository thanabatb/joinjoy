import { expect, test } from "@playwright/test";

test("create event shows inline validation for required and custom cost fields", async ({ page }) => {
  await page.goto("/create");

  await page.getByRole("button", { name: "Custom" }).nth(0).click();
  await page.getByRole("button", { name: "Custom" }).nth(1).click();

  await page.locator("#serviceChargeRate").fill("");
  await page.locator("#vatRate").fill("");

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/create$/);
  await expect(page.getByText("Oops, give this event a name.")).toBeVisible();
  await expect(page.getByText("Oops, who’s hosting this one?")).toBeVisible();
  await expect(page.getByText("Add the service charge amount.")).toBeVisible();
  await expect(page.getByText("Add the VAT amount.")).toBeVisible();
});
