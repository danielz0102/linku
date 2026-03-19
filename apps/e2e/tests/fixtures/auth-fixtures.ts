import type { LinkuAPI } from "@linku/api-contract"

import { test as base, expect } from "@playwright/test"

import { UserMother } from "../utils/user-mother.js"

type Fixtures = {
  registeredUser: LinkuAPI.RegisterUser["RequestBody"]
}

export const test = base.extend<Fixtures>({
  registeredUser: async ({ request }, use) => {
    const user = UserMother.createRegistration()
    await request.post("http://localhost:3000/auth/register", {
      data: user,
    })
    await use(user)
  },
})

export { expect }
