import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { UserProvider } from "~/modules/users/context/user-context"

import { Router } from "./router"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router />
      </UserProvider>
    </QueryClientProvider>
  )
}
