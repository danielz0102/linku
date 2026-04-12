import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "../../../api/src/server/app-router.ts"
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
