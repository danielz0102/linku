import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"

import { ProtectedRoute } from "~/auth/components/protected-route"
import { Layout } from "~/shared/components/layout/layout"

import { ErrorPage } from "./pages/error-page"

const Home = lazy(() => import("~/home/home"))
const Login = lazy(() => import("~/auth/login"))
const Register = lazy(() => import("~/auth/register"))
const Profile = lazy(() => import("~/profile/profile"))
const UpdateProfile = lazy(() => import("~/profile/update-profile"))
const SearchUsers = lazy(() => import("~/users/search-users"))
const PublicProfile = lazy(() => import("~/users/public-profile"))

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
        <Route path="*" element={<ErrorPage status={404} message="Page not found" />} />
      </Routes>
    </BrowserRouter>
  )
}
