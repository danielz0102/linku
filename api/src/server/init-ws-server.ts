import type { Server as HTTPServer } from "node:http"

import { Server } from "socket.io"

import { CLIENT_ORIGIN } from "#env.ts"

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../shared/socket-io-server-types.ts"
import { onConnection } from "./event-handlers/on-connection-handler.ts"
import { authMiddleware } from "./middlewares/auth-socket-middleware.ts"
import { sessionMiddleware } from "./middlewares/session-middleware.ts"

export function initWSServer(httpServer: HTTPServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  })

  io.engine.use(sessionMiddleware)
  io.use(authMiddleware)

  io.on("connection", onConnection(io))
}
