import { QueryClient } from "@tanstack/react-query"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { api } from "./api-client"

export const queryClient = new QueryClient()

const trpc = createTRPCOptionsProxy({
  client: api,
  queryClient,
})

export { trpc as api }
