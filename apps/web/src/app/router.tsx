import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"

import { ProtectedRoute } from "~/sections/auth/components/protected-route"
import { Layout } from "~/ui/layout/layout"

import { ErrorPage } from "./pages/error-page"

const Login = lazy(() => import("~/sections/auth/login"))
const Register = lazy(() => import("~/sections/auth/register"))
const LogOut = lazy(() => import("./pages/log-out"))
const Home = lazy(() => import("~/sections/home/home"))
const Profile = lazy(() => import("~/sections/profile/profile"))
const UpdateProfile = lazy(() => import("~/sections/profile/update-profile"))
const SearchUsers = lazy(() => import("~/sections/users/search-users"))
const PublicProfile = lazy(() => import("~/sections/users/public-profile"))

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
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="search-users" element={<SearchUsers />} />
          <Route path="users/:id" element={<PublicProfile />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="log-out" element={<LogOut />} />
        <Route path="*" element={<ErrorPage status={404} message="Page not found" />} />
      </Routes>
    </BrowserRouter>
  )
}
