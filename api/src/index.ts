import { createServer } from "node:http"

import express from "express"

import { PORT } from "#env.ts"
import { initWSServer } from "#server/init-ws-server.ts"
import { corsMiddleware } from "#server/middlewares/cors-middleware.ts"
import { enrichMiddleware } from "#server/middlewares/enrich-middleware.ts"
import { notFoundMiddleware } from "#server/middlewares/not-found-middleware.ts"
import { sessionMiddleware } from "#server/middlewares/session-middleware.ts"
import { unexpectedErrorMiddleware } from "#server/middlewares/unexpected-error-middleware.ts"
import { appRouter } from "#server/routers/app-router.ts"

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(enrichMiddleware)
app.set("trust proxy", 1)

app.use(corsMiddleware)
app.use(sessionMiddleware)

app.use(appRouter)

app.use(notFoundMiddleware)
app.use(unexpectedErrorMiddleware)

initWSServer(server)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
