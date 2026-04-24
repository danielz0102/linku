import type { Server as HTTPServer } from "node:http"

import { Server } from "socket.io"

import { CLIENT_ORIGIN } from "#env.ts"

export function createWsServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
    },
  })

  return io
}
