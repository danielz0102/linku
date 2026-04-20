import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

import { ChatCard } from "./chat-card"
import { getChats } from "./get-chats"

export default function HomePage() {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
    initialData: [],
  })

  return (
    <main
      className="flex size-full flex-col overflow-y-auto data-loading:items-center data-loading:justify-center"
      data-loading={isLoading || undefined}
    >
      {isLoading && <p className="text-muted animate-pulse">Loading chats...</p>}

      {chats.map((chat) => (
        <Link
          key={chat.id}
          to={`/chat/${chat.id}`}
          className="hover:bg-hover max-w-xs rounded md:max-w-lg"
        >
          <ChatCard chat={chat} />
        </Link>
      ))}
    </main>
  )
}
