import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router"

const LoginPage = lazy(() => import("./auth/pages/login-page"))
const SignUpPage = lazy(() => import("./auth/pages/sign-up-page"))
const HomePage = lazy(() => import("./app"))

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
