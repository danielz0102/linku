import { expect, test } from "@playwright/test";

test("redirects user to login page if not authenticated", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});
