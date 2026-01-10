import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/home"
import Login from "./pages/login"

export default function Router() {
  return (
    <BrowserRouter>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
