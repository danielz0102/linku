import { createApp } from "#app/index.js"
import { PORT } from "./shared/config/env.js"

const app = createApp()

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
