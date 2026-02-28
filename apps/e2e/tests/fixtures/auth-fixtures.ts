import { test as base, expect } from "@playwright/test";
import type { LinkuAPI } from "@linku/api-contract";
import { UserMother } from "../utils/user-mother.js";

type Fixtures = {
  registeredUser: LinkuAPI.RegisterUser["RequestBody"];
};

export const test = base.extend<Fixtures>({
  registeredUser: async ({ request }, use) => {
    const user = UserMother.createRegistration();
    const registerResponse = await request.post("http://localhost:3000/users", {
      data: user,
    });

    expect(registerResponse.ok()).toBe(true);
    await use(user);
  },
});

export { expect };
