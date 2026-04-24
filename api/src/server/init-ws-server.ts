import type { Server as HTTPServer } from "node:http"

import { Server } from "socket.io"

import { CLIENT_ORIGIN } from "#env.ts"

export function initWsServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id)
  })
}
