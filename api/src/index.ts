import { notFound } from "#middlewares/not-found.js"
import { unexpectedError } from "#middlewares/unexpected-error.js"
import { usersRouter } from "#users/index.js"
import cors from "cors"
import express from "express"
import { ALLOWED_ORIGIN, PORT } from "./config/env.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))

app.use("/users", usersRouter)

app.use(notFound)
app.use(unexpectedError)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
