import Navbar from "~/components/Navbar"

export default function Home() {
  return (
    <main className="bg-primary flex min-h-dvh flex-col [&>nav]:border-t [&>nav]:border-gray-300">
      <header className="p-4">
        <h1 className="title text-center">Messages</h1>
      </header>
      <main className="center flex-1">
        <p>There are no messages yet.</p>
      </main>
      <Navbar />
    </main>
  )
}
