import type { Server as HTTPServer } from "node:http"

import type { Request } from "express"
import { Server } from "socket.io"

import { CLIENT_ORIGIN } from "#env.ts"

import { sessionMiddleware } from "./middlewares/session-middleware.ts"
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socket-io-server-types.ts"

export function initWSServer(httpServer: HTTPServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  })

  io.engine.use(sessionMiddleware)

  io.use((socket, next) => {
    const request = socket.request as Request

    if (request.session?.userId) {
      socket.data.userId = request.session.userId
      return next()
    }

    next(new Error("Unauthorized"))
  })

  io.on("connection", (socket) => {
    socket.on("join_chat", async ({ peerId }) => {
      const roomId = computeChatRoomId(socket.data.userId, peerId)
      await socket.join(roomId)
    })
  })
}

function computeChatRoomId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("_")
}
