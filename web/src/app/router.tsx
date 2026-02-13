import { BrowserRouter, Route, Routes } from "react-router"
import Login from "../users/login"
import Register from "../users/register"
import Home from "./pages/home"

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
