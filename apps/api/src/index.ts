import { createServer } from "node:http"
import { createApp } from "#app/index.js"
import { createWebSocketServer } from "#messages/infrastructure/websocket/websocket-server.js"
import { PORT } from "./shared/config/env.js"

const { app, sessionMiddleware } = createApp()
const httpServer = createServer(app)

createWebSocketServer(httpServer, sessionMiddleware)

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
