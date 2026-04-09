import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "../../../api/src/server/app-router.ts"
import { API_URL } from "../env.ts"

const trpcUrl = API_URL.endsWith("/trpc") ? API_URL : `${API_URL.replace(/\/$/, "")}/trpc`

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcUrl,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" })
      },
    }),
  ],
})
