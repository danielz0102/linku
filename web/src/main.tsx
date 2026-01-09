// Supports weights 400-900
import "@fontsource-variable/playfair-display"
// Supports weights 100-900
import "@fontsource-variable/archivo"
import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./app"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Failed to find the root element")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
