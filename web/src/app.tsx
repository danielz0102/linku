import { ErrorBoundary } from "react-error-boundary"
import UnexpectedError from "./pages/unexpected-error"
import AuthProvider from "./providers/auth-provider"
import Router from "./router"

export default function App() {
  return (
    <ErrorBoundary fallback={<UnexpectedError />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ErrorBoundary>
  )
}
