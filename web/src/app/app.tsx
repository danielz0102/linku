import { QueryAPIClientProvider } from "./query-api-client-provider"
import { Router } from "./router"

export function App() {
  return (
    <QueryAPIClientProvider>
      <Router />
    </QueryAPIClientProvider>
  )
}
