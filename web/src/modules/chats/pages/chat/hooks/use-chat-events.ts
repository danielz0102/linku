import { useEffect } from "react"

import { createSocket, type ClientToServerEvents } from "../socket"

export function useChatEvents(peerUsername: string) {
  const socket = createSocket()

  useEffect(() => {
    socket.emit("join_chat", { peerUsername })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = (message: Parameters<ClientToServerEvents["send_message"]>[0]) => {
    socket.emit("send_message", message)
  }

  return { sendMessage }
}
