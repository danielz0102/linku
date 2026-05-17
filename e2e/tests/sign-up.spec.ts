import { expect, test } from "@playwright/test"

import { sql } from "../db/db-client.ts"
import { test as registeredUserTest } from "../fixtures/registered-user.ts"

test.describe("Sign Up Page", () => {
  test("logs in on successful registration", async ({ page }) => {
    const username = `signup_user_${Date.now()}`
    const password = "Test@1234"

    await page.goto("/sign-up")

    await page.getByLabel("First Name").fill("Test")
    await page.getByLabel("Last Name").fill("User")
    await page.getByLabel("Username").fill(username)
    await page.getByLabel("Password", { exact: true }).fill(password)
    await page.getByLabel("Confirm Password").fill(password)
    await page.getByRole("button", { name: "Sign up" }).click()

    await expect(page.getByText("My Chats")).toBeVisible()

    await sql`DELETE FROM users WHERE username = ${username}`
  })

  registeredUserTest("rejects if username already exists", async ({ page, registeredUser }) => {
    await page.goto("/sign-up")

    await page.getByLabel("First Name").fill("Test")
    await page.getByLabel("Last Name").fill("User")
    await page.getByLabel("Username").fill(registeredUser.username)
    await page.getByLabel("Password", { exact: true }).fill(registeredUser.password)
    await page.getByLabel("Confirm Password").fill(registeredUser.password)
    await page.getByRole("button", { name: "Sign up" }).click()

    await expect(page.getByText(/username.*taken/i)).toBeVisible()
  })
})
