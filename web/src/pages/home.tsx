import { useEffect } from "react"
import { useNavigate } from "react-router"
import Navbar from "~/components/Navbar"
import { useAuth } from "~/hooks/use-auth"

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

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
