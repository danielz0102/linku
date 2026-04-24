import type { Server as HTTPServer } from "node:http"

import type { Request } from "express"
import { Server } from "socket.io"

import { CLIENT_ORIGIN } from "#env.ts"

import { sessionMiddleware } from "./middlewares/session-middleware.ts"

export function initWsServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  })

  io.engine.use(sessionMiddleware)
  io.use((socket, next) => {
    const request = socket.request as Request

    if (request.session?.userId) {
      return next()
    }

    next(new Error("Unauthorized"))
  })

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id)
  })
}
