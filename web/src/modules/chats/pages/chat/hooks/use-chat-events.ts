import { useEffect, useRef } from "react"

import { Message } from "~/modules/chats/domain/message"

import type { SendMessageEvent } from "../socket/events"
import { createSocket } from "../socket/socket"

type UseChatEventsOptions = {
  onNewMessage: (message: Message) => void
}

export function useChatEvents(peerUsername: string, { onNewMessage }: UseChatEventsOptions) {
  const socketRef = useRef(createSocket())

  useEffect(() => {
    const socket = socketRef.current

    socket.emit("join_chat", { peerUsername })
    socket.on("new_message", (data) => {
      onNewMessage(Message.create(data))
    })

    return () => {
      socket.off("new_message")
    }
  }, [peerUsername, onNewMessage])

  const sendMessage = (message: Parameters<SendMessageEvent>[0]) => {
    socketRef.current.emit("send_message", message, (error) => {
      console.error("Failed to send message", error)
    })
  }

  return { sendMessage }
}
