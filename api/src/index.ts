import express from "express"
import { PORT } from "./config/env.js"

const app = express()

app.get("/", (_, res) => {
  res.send("Hello, World!")
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
