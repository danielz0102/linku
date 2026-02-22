import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { ProtectedRoute } from "~/auth/components/protected-route"
import { Layout } from "~/shared/layout/layout"

const Home = lazy(() => import("~/home/home"))
const Login = lazy(() => import("~/auth/login"))
const Register = lazy(() => import("~/auth/register"))
const Profile = lazy(() => import("~/profile/profile"))

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
