import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AuthProvider } from "~/modules/users/context/auth-context"

import { Router } from "./router"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  )
}
