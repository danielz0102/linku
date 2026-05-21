import { test, expect } from "@playwright/test"

test("shows an alert after too many attempts", async ({ page }) => {
  await page.goto("/")
  const usernameInput = page.getByLabel("Username")
  const passwordInput = page.getByLabel("Password")
  const loginButton = page.getByRole("button", { name: "Login" })

  for (let i = 0; i < 6; i++) {
    await usernameInput.fill("invalid_user")
    await passwordInput.fill("invalid_password")
    await loginButton.click()
  }

  await expect(page.getByRole("alert")).toContainText(/Too many attempts/i)
})
