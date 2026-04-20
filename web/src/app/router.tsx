import { lazy } from "react"
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router"

import { ProtectedLayout } from "~/modules/users/layout/protected-layout"

const LoginPage = lazy(() => import("~/modules/users/pages/login/login-page"))
const SignUpPage = lazy(() => import("~/modules/users/pages/sign-up/sign-up-page"))
const HomePage = lazy(() => import("~/modules/chats/pages/home/home-page"))
const ChatPage = lazy(() => import("~/modules/chats/pages/chat/chat-page.tsx"))
const ProfilePage = lazy(() => import("~/modules/users/pages/profile/profile-page"))
const PublicProfilePage = lazy(() => import("~/modules/users/pages/profile/public-profile-page"))
const SearchPage = lazy(() => import("~/modules/users/pages/search/search-page"))
const NotFoundPage = lazy(() => import("~/app/pages/not-found-page"))

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
          <Route path="/chat/:username" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<PublicProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
