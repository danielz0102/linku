import { PORT } from "#config/env.js"
import express from "express"

const app = express()

app.get("/", (_, res) => {
  res.send("Hello, World!")
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
