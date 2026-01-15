import { ALLOWED_ORIGIN, PORT } from "#config/env.js"
import { handleUnexpectedError } from "#middlewares/handle-error.js"
import { handleNotFound } from "#middlewares/handle-not-found.js"
import cors from "cors"
import express from "express"

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
app.use(handleNotFound)
app.use(handleUnexpectedError)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
