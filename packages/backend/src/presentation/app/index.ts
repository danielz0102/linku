import cors from "cors"
import express from "express"
import { CLIENT_ORIGIN } from "../../infraestructure/config/env.js"
import router from "./routes/index.js"

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())
app.use(router)

export default app
