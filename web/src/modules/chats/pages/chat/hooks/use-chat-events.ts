import { useEffect } from "react"

import { createSocket } from "../socket"

export function useChatEvents(peerUsername: string) {
  const socket = createSocket()

  useEffect(() => {
    socket.emit("join_chat", { peerUsername })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = (message: { text?: string; attachmentURL?: string }) => {
    socket.emit("send_message", message)
  }

  return { sendMessage }
}
