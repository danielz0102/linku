import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router"

const LoginPage = lazy(() => import("./auth/pages/login-page"))

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
