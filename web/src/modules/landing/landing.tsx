import { Link } from "react-router"

import chatMobileImage from "./assets/chat-mobile.png"
import chatImage from "./assets/chat.png"

export default function Landing() {
  return (
    <main className="bg-background flex flex-col items-center gap-6 p-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-bold">Linku</h1>
        <p className="text-muted">Chat with your friends</p>
      </div>

      <img
        src={chatMobileImage}
        className="max-h-128 max-w-sm rounded-lg shadow md:hidden"
        // oxlint-disable-next-line jsx_a11y/img-redundant-alt
        alt="Chat interface showing a conversation with a user named Linus Loeliger, including a sent photo of a black-and-white kitten lying on its back with its paws raised"
      />

      <img
        src={chatImage}
        className="hidden max-w-5xl rounded-lg shadow md:block"
        // oxlint-disable-next-line jsx_a11y/img-redundant-alt
        alt="Chat interface showing a conversation with a user named Linus Loeliger, including a sent photo of a black-and-white kitten lying on its back with its paws raised"
      />

      <Link to="/log-in" className="button px-8 text-lg">
        Start chatting
      </Link>
    </main>
  )
}
