import { expect, test } from "./fixtures/auth-fixtures.ts";

test("redirects user to home page on login", async ({
  page,
  registeredUser,
}) => {
  const { username, password } = registeredUser;

  await page.goto("/login");

  const usernameInput = page.getByRole("textbox", { name: "Username" });
  const passwordInput = page.getByRole("textbox", { name: "Password" });
  const loginButton = page.getByRole("button", { name: "Log In" });

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  await expect(page).toHaveURL("/");
});

test("fails with incorrect password", async ({ page, registeredUser }) => {
  const { username } = registeredUser;

  await page.goto("/login");

  const usernameInput = page.getByRole("textbox", { name: "Username" });
  const passwordInput = page.getByRole("textbox", { name: "Password" });
  const loginButton = page.getByRole("button", { name: "Log In" });

  await usernameInput.fill(username);
  await passwordInput.fill("wrongpassword");
  await loginButton.click();

  await expect(page).toHaveURL("/login");
  await expect(page.getByText(/invalid/i)).toBeVisible();
});
