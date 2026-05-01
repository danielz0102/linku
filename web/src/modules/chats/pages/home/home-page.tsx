import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

import { ChatCard } from "./chat-card"
import { getChatCardsData } from "./get-chat-cards-data"

export default function HomePage() {
  const chats = useQuery({
    queryKey: ["chats"],
    queryFn: getChatCardsData,
    initialData: [],
  })

  return (
    <main className="flex size-full flex-col gap-2 overflow-y-auto">
      <h1 className="title p-3">My Chats</h1>

      {chats.isLoading && <p className="text-muted m-auto animate-pulse">Loading chats...</p>}

      {chats.data.length === 0 && !chats.isLoading && (
        <div className="m-auto space-y-1 text-center">
          <h1 className="title">No chats yet.</h1>
          <Link to="/search" className="link underline">
            Search friends to start a conversation.
          </Link>
        </div>
      )}

      {chats.data.map((chat) => (
        <Link
          key={chat.peer.id}
          to={`/chat/${chat.peer.username}`}
          className="hover:bg-hover rounded md:w-lg"
        >
          <ChatCard
            user={chat.peer}
            data={{
              date: chat.lastMessage.createdAt,
              isRead: chat.lastMessage.isRead,
              text: chat.lastMessage.text,
            }}
          />
        </Link>
      ))}
    </main>
  )
}
