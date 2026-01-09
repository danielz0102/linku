import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import Home from "./pages/home"
import Login from "./pages/login"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
