import type { LinkuAPI } from "@linku/api-contract"
import type { IncomingMessage } from "node:http"
import type { Server as HttpServer } from "node:http"
import type { Session, SessionData } from "express-session"
import { WebSocketServer as WsServer, WebSocket } from "ws"
import { SendMessageUseCase } from "#messages/application/use-cases/send-message-use-case.js"
import { DrizzleConversationRepository } from "#messages/infrastructure/adapters/drizzle-conversation-repository.js"
import { DrizzleMessageRepository } from "#messages/infrastructure/adapters/drizzle-message-repository.js"

type AuthenticatedRequest = IncomingMessage & {
  session: Session & Partial<SessionData>
}

const connections = new Map<string, Set<WebSocket>>()

function addConnection(userId: string, ws: WebSocket): void {
  if (!connections.has(userId)) {
    connections.set(userId, new Set())
  }
  connections.get(userId)!.add(ws)
}

function removeConnection(userId: string, ws: WebSocket): void {
  const userConnections = connections.get(userId)
  if (userConnections) {
    userConnections.delete(ws)
    if (userConnections.size === 0) {
      connections.delete(userId)
    }
  }
}

function broadcastToUser(
  userId: string,
  message: LinkuAPI.WebSocketServerMessage
): void {
  const userConnections = connections.get(userId)
  if (!userConnections) return

  const data = JSON.stringify(message)
  for (const ws of userConnections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data)
    }
  }
}

function sendError(ws: WebSocket, message: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "error", payload: { message } }))
  }
}

export function createWebSocketServer(
  httpServer: HttpServer,
  sessionMiddleware: (
    req: IncomingMessage,
    res: unknown,
    next: () => void
  ) => void
): WsServer {
  const sendMessageUseCase = new SendMessageUseCase({
    conversationRepo: new DrizzleConversationRepository(),
    messageRepo: new DrizzleMessageRepository(),
  })

  const wss = new WsServer({ server: httpServer })

  wss.on("connection", (ws, req: AuthenticatedRequest) => {
    sessionMiddleware(req, {}, () => {
      const userId = req.session?.userId

      if (!userId) {
        ws.close(1008, "Unauthorized")
        return
      }

      addConnection(userId, ws)

      ws.on("message", async (data) => {
        let message: LinkuAPI.WebSocketClientMessage

        try {
          message = JSON.parse(data.toString()) as LinkuAPI.WebSocketClientMessage
        } catch {
          sendError(ws, "Invalid message format")
          return
        }

        if (message.type === "send_message") {
          const { recipientId, content } = message.payload

          const result = await sendMessageUseCase.execute({
            senderId: userId,
            recipientId,
            content,
          })

          if (!result.ok) {
            sendError(ws, result.error)
            return
          }

          const serverMessage: LinkuAPI.WebSocketServerMessage = {
            type: "new_message",
            payload: { message: result.data },
          }

          broadcastToUser(userId, serverMessage)
          broadcastToUser(recipientId, serverMessage)
        }
      })

      ws.on("close", () => {
        removeConnection(userId, ws)
      })
    })
  })

  return wss
}
