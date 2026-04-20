import { Link } from "react-router"

import { ChatCard } from "./chat-card"

export default function HomePage() {
  return (
    <main className="flex flex-col overflow-y-auto">
      <Link to="/chat/1" className="hover:bg-hover max-w-lg rounded">
        <ChatCard
          imgUrl="https://cataas.com/cat"
          name="John Doe"
          lastMessage="Hey, how are you?"
          time={new Date()}
        />
      </Link>
      <Link to="/chat/2" className="hover:bg-hover max-w-lg rounded">
        <ChatCard
          imgUrl="https://cataas.com/cat"
          name="Jane Smith"
          lastMessage="Let's catch up later."
          time={new Date(Date.now() - 3600 * 1000)}
          isRead
        />
      </Link>
      <Link to="/chat/3" className="hover:bg-hover max-w-lg rounded">
        <ChatCard
          imgUrl="https://cataas.com/cat"
          name="Alice Johnson"
          lastMessage="Can you send me the report?"
          time={new Date(Date.now() - 2 * 3600 * 1000)}
        />
      </Link>
      <Link to="/chat/4" className="hover:bg-hover max-w-lg rounded">
        <ChatCard
          imgUrl="https://cataas.com/cat"
          name="Bob Brown"
          lastMessage="Thanks for your help!"
          time={new Date(Date.now() - 3 * 3600 * 1000)}
          isRead
        />
      </Link>
    </main>
  )
}
