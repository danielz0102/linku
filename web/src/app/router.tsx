import { Suspense, lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { AuthProvider } from "~/users/context/auth-provider"
import { ProtectedRoute } from "./components/protected-route"

const Home = lazy(() => import("./pages/home"))
const Login = lazy(() => import("~/users/login"))
const Register = lazy(() => import("~/users/register"))

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  )
}
