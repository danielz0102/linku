import { expect } from "@playwright/test"

import { test } from "../fixtures/registered-user.ts"

test("logs in successfully with valid credentials", async ({ page, registeredUser }) => {
  const { username, password } = registeredUser

  await page.goto("/")
  const usernameInput = page.getByLabel("Username")
  const passwordInput = page.getByLabel("Password")
  const loginButton = page.getByRole("button", { name: "Login" })

  await usernameInput.fill(username)
  await passwordInput.fill(password)
  await loginButton.click()

  await expect(page).toHaveTitle(/Home/)
})

test("fails to login with invalid credentials", async ({ page }) => {
  await page.goto("/")
  const usernameInput = page.getByLabel("Username")
  const passwordInput = page.getByLabel("Password")
  const loginButton = page.getByRole("button", { name: "Login" })

  await usernameInput.fill("invalid_user")
  await passwordInput.fill("invalid_password")
  await loginButton.click()

  await expect(page.getByText("Invalid credentials")).toBeVisible()
})
