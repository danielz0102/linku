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
    <main className="flex size-full flex-col gap-2 overflow-y-auto">
      <h1 className="title p-3">My Chats</h1>

      {isLoading && <p className="text-muted m-auto animate-pulse">Loading chats...</p>}

      {chats.length === 0 && !isLoading && (
        <p className="text-muted m-auto">No chats yet. Start a new conversation!</p>
      )}

      {chats.map((chat) => (
        <Link key={chat.id} to={`/chat/${chat.id}`} className="hover:bg-hover rounded md:w-lg">
          <ChatCard chat={chat} />
        </Link>
      ))}
    </main>
  )
}
