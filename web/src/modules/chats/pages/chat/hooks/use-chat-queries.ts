import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { getChatMember } from "../api/get-chat-member"
import { getMessages } from "../api/get-chat-messages"

export function useChatQueries(peerUsername: string) {
  const messages = useInfiniteQuery({
    queryKey: ["messages", peerUsername],
    initialPageParam: undefined as Date | undefined,
    queryFn: ({ pageParam }) => {
      return getMessages({ peerUsername, olderThan: pageParam })
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const peer = useQuery({
    queryKey: ["chat-member", peerUsername],
    queryFn: () => getChatMember(peerUsername),
    throwOnError: true,
    refetchOnWindowFocus: false,
  })

  return { messages, peer }
}
