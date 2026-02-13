// Supports weights 100-900
import "@fontsource-variable/inter"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./app/index.tsx"
import "./index.css"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Failed to find the root element")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
