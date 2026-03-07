import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { ErrorPage } from "~/app/pages/error-page"
import { AuthProvider } from "~/auth/context/auth-provider"
import { Router } from "./router"

const queryClient = new QueryClient()

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
