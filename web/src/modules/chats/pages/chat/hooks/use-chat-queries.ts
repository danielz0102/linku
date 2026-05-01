import { useQueries } from "@tanstack/react-query"

import { getChatMember } from "../get-chat-member"
import { getMessages } from "../get-chat-messages"

export function useChatQueries(peerUsername: string) {
  return useQueries({
    queries: [
      {
        queryKey: ["messages", peerUsername],
        queryFn: () => getMessages(peerUsername),
        throwOnError: true,
      },
      {
        queryKey: ["chat-member", peerUsername],
        queryFn: () => getChatMember(peerUsername),
        throwOnError: true,
      },
    ],
  })
}
