import { authRouter } from "#routers/auth-router.js"
import cors from "cors"
import express from "express"
import { ALLOWED_ORIGIN, PORT } from "./config/env.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))

app.use(authRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
