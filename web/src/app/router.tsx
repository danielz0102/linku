import { Suspense, lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router"

const Home = lazy(() => import("./pages/home"))
const Login = lazy(() => import("~/users/login"))
const Register = lazy(() => import("~/users/register"))

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
