import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
// Supports weights 200-900
import "@fontsource-variable/nunito-sans/wght.css"
import { Router } from "./router.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
