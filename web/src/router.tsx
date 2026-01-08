import { ErrorBoundary } from "react-error-boundary"
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home"
import Login from "./pages/login"
import NotFound from "./pages/not-found"
import UnexpectedError from "./pages/unexpected-error"
import AuthProvider from "./providers/auth-provider"

export default function Router() {
  return (
    <AuthProvider>
      <ErrorBoundary fallback={<UnexpectedError />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}
