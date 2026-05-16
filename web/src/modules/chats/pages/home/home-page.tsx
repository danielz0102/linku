import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

import { ChatCard } from "./chat-card"
import { getChats } from "./get-chats"

export default function HomePage() {
  const chats = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
    throwOnError: true,
  })

  return (
    <main className="flex size-full flex-col gap-2 overflow-y-auto">
      <title>Linku - Home</title>
      <h1 className="title p-3">My Chats</h1>

      {chats.isLoading && <p className="text-muted m-auto animate-pulse">Loading chats...</p>}

      {chats.data?.length === 0 && !chats.isLoading && (
        <div className="m-auto space-y-1 text-center">
          <h1 className="title">No chats yet.</h1>
          <Link to="/search" className="link underline">
            Search friends to start a conversation.
          </Link>
        </div>
      )}

      {chats.data?.map((chat) => (
        <Link
          key={chat.peer.id}
          to={`/chat/${chat.peer.username}`}
          className="hover:bg-hover rounded md:w-lg"
        >
          <ChatCard peer={chat.peer} message={chat.lastMessage} hasUnreads={chat.hasUnreads} />
        </Link>
      ))}
    </main>
  )
}
