import { lazy } from "react"
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router"

import { ProtectedLayout } from "~/modules/users/components/protected-layout"

const LoginPage = lazy(() => import("~/modules/users/pages/login/login-page"))
const SignUpPage = lazy(() => import("~/modules/users/pages/sign-up/sign-up-page"))
const HomePage = lazy(() => import("~/modules/users/pages/home/home-page"))
const ProfilePage = lazy(() => import("~/modules/users/pages/profile/profile-page"))

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          element={
            <ProtectedLayout redirectTo={<Navigate to="/log-in" replace />}>
              <Outlet />
            </ProtectedLayout>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
