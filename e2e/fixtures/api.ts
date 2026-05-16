import { test as base, type APIRequestContext } from "@playwright/test"

export const test = base.extend<{}, { api: APIRequestContext }>({
  api: [
    async ({ playwright }, use) => {
      const api = await playwright.request.newContext({
        baseURL: "http://localhost:3001",
      })
      await use(api)
      await api.dispose()
    },
    { scope: "worker" },
  ],
})
