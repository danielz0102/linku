import { ErrorBoundary } from "react-error-boundary"
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home"
import NotFound from "./pages/not-found"
import UnexpectedError from "./pages/unexpected-error"

export default function Router() {
  return (
    <ErrorBoundary fallback={<UnexpectedError />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
