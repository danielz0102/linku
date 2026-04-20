import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"

import { UserProvider } from "~/modules/users/context/user-context"

import UnexpectedErrorPage from "./pages/unexpected-error-page"
import { Router } from "./router"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ErrorBoundary FallbackComponent={UnexpectedErrorPage}>
          <Router />
        </ErrorBoundary>
      </UserProvider>
    </QueryClientProvider>
  )
}
