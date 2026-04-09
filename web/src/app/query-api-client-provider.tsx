import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "../api/api-tanstack-proxy"

export function QueryAPIClientProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
