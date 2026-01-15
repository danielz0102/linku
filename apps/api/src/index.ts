import { PORT, ALLOWED_ORIGIN } from "#config/env.js"
import express from "express"
import cors from "cors"

const app = express()

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
)
app.use(express.json())

app.get("/", (_, res) => {
  res.send("Hello, World!")
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
