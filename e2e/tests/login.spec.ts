import { expect } from "@playwright/test"

import { test } from "../fixtures/registered-user.ts"

test.describe("Login Page", () => {
  test("logs in successfully with valid credentials", async ({ page, registeredUser }) => {
    const { username, password } = registeredUser

    await page.goto("/")
    const usernameInput = page.getByLabel("Username")
    const passwordInput = page.getByLabel("Password")
    const loginButton = page.getByRole("button", { name: "Login" })

    await usernameInput.fill(username)
    await passwordInput.fill(password)
    await loginButton.click()

    await expect(page.getByText("My Chats")).toBeVisible()
  })

  test("rejects login with invalid credentials", async ({ page }) => {
    await page.goto("/")
    const usernameInput = page.getByLabel("Username")
    const passwordInput = page.getByLabel("Password")
    const loginButton = page.getByRole("button", { name: "Login" })

    await usernameInput.fill("invalid_user")
    await passwordInput.fill("invalid_password")
    await loginButton.click()

    await expect(page.getByText("Invalid credentials")).toBeVisible()
  })

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

    await expect(page.getByRole("alert")).toContainText("Too many attempts. Try again later")
  })
})
