import { test, expect } from "./fixtures/auth-fixtures.js";
import { UserMother } from "./utils/user-mother.js";

test("redirects user to home page on registration", async ({ page }) => {
  const { email, username, password, firstName, lastName } =
    UserMother.createRegistration();

  await page.goto("/register");

  const emailInput = page.getByRole("textbox", { name: /Email/ });
  const usernameInput = page.getByRole("textbox", { name: "Username" });
  const passwordInput = page.getByLabel("Password", { exact: true });
  const confirmPasswordInput = page.getByLabel("Confirm Password", {
    exact: true,
  });
  const firstNameInput = page.getByRole("textbox", { name: "First Name" });
  const lastNameInput = page.getByRole("textbox", { name: "Last Name" });
  const submitButton = page.getByRole("button", { name: "Create Account" });

  await emailInput.fill(email);
  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await confirmPasswordInput.fill(password);
  await firstNameInput.fill(firstName);
  await lastNameInput.fill(lastName);
  await submitButton.click();

  await expect(page).toHaveURL("/");
});

test("fails if username already exists", async ({ page, registeredUser }) => {
  const { email, username, password, firstName, lastName } = registeredUser;

  await page.goto("/register");

  const emailInput = page.getByRole("textbox", { name: /Email/ });
  const usernameInput = page.getByRole("textbox", { name: "Username" });
  const passwordInput = page.getByLabel("Password", { exact: true });
  const confirmPasswordInput = page.getByLabel("Confirm Password", {
    exact: true,
  });
  const firstNameInput = page.getByRole("textbox", { name: "First Name" });
  const lastNameInput = page.getByRole("textbox", { name: "Last Name" });
  const submitButton = page.getByRole("button", { name: "Create Account" });

  await emailInput.fill(email);
  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await confirmPasswordInput.fill(password);
  await firstNameInput.fill(firstName);
  await lastNameInput.fill(lastName);
  await submitButton.click();

  await expect(page).toHaveURL("/register");
  await expect(page.getByText("Username already exists")).toBeVisible();
});
