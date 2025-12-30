import express from "express"
import indexRouter from "~/routers/index.js"
import { corsMiddleware } from "./middlewares/cors.js"

const app = express()

app.use(corsMiddleware)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", indexRouter)

export default app
