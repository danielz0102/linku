import { corsMiddleware } from "#middlewares/cors-middleware.js"
import { notFound } from "#middlewares/not-found.js"
import { sessionMiddleware } from "#middlewares/session-middleware.js"
import { unexpectedError } from "#middlewares/unexpected-error.js"
import { usersRouter } from "#users/index.js"
import express from "express"
import { PORT } from "./config/env.js"

const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(corsMiddleware)
app.use(sessionMiddleware)

app.use("/users", usersRouter)

app.use(notFound)
app.use(unexpectedError)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
