import type { Request } from "express"
import type { ExtendedError } from "socket.io"

import type { AppSocket } from "#shared/socket-io-server-types.ts"

export const authMiddleware = (socket: AppSocket, next: (err?: ExtendedError) => void) => {
  const request = socket.request as Request

  if (request.session?.userId) {
    socket.data.userId = request.session.userId
    return next()
  }

  next(new Error("Unauthorized"))
}
