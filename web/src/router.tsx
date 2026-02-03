import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home"
import Register from "./pages/register"

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
