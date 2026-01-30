import { BrowserRouter, Route, Routes } from "react-router"
import Register from "./pages/register"

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
