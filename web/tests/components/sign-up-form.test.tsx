import { render } from "vitest-browser-react"

import { SignUpForm } from "~/modules/users/pages/sign-up/sign-up-form"

test("shows a username error when provided", async () => {
  const screen = await render(<SignUpForm onSubmit={async () => ({ error: "USERNAME_TAKEN" })} />)

  await screen.getByLabelText("First Name").fill("John")
  await screen.getByLabelText("Last Name").fill("Doe")
  await screen.getByLabelText("Username").fill("john_doe")
  await screen.getByLabelText("Password", { exact: true }).fill("P@ssword1")
  await screen.getByLabelText("Confirm Password").fill("P@ssword1")

  await screen.getByRole("button", { name: "Sign up" }).click()

  await expect.element(screen.getByText("Username is already taken")).toBeVisible()
})

test("fails when passwords do not match", async () => {
  const screen = await render(<SignUpForm onSubmit={async () => undefined} />)

  await screen.getByLabelText("First Name").fill("John")
  await screen.getByLabelText("Last Name").fill("Doe")
  await screen.getByLabelText("Username").fill("john_doe")
  await screen.getByLabelText("Password", { exact: true }).fill("P@ssword1")
  await screen.getByLabelText("Confirm Password").fill("P@ssword2")

  await screen.getByRole("button", { name: "Sign up" }).click()

  await expect.element(screen.getByText("Passwords do not match")).toBeVisible()
})
