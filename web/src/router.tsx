import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router"

import { Layout } from "./shared/ui/layout"

const LoginPage = lazy(() => import("./auth/pages/login-page"))
const SignUpPage = lazy(() => import("./auth/pages/sign-up-page"))
const HomePage = lazy(() => import("./users/pages/home-page.tsx"))
const ProfilePage = lazy(() => import("./users/pages/profile-page.tsx"))

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
