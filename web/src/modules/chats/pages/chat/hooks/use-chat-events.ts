import { useEffect } from "react"

import type { SendMessageEvent } from "../socket/events"
import { createSocket } from "../socket/socket"

export function useChatEvents(peerUsername: string) {
  const socket = createSocket()

  useEffect(() => {
    socket.emit("join_chat", { peerUsername })

    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [])

  const sendMessage = (message: Parameters<SendMessageEvent>[0]) => {
    socket.emit("send_message", message, (error) => {
      throw new Error("Failed to send message", { cause: error })
    })
  }

  return { sendMessage }
}
