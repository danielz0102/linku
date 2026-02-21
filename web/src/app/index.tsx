import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { AuthProvider } from "~/users/context/auth-provider"
import { Router } from "./router"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  )
}
