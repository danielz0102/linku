import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "@fontsource/poppins"
import App from "./App.tsx"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
