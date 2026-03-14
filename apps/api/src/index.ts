import { createApp } from "#server/index.js"

import { PORT } from "./env.js"

const app = createApp()

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
