import type { AppRouter } from "@linku/api"
import { createTRPCClient, httpBatchLink } from "@trpc/client"

import { API_URL } from "../env.ts"

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" })
      },
    }),
  ],
})
