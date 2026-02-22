import { useState } from "react"
import { useAuth } from "~/auth/context/auth-context"

export default function Home() {
  const { logout } = useAuth()
  const [error, setError] = useState("")

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error(error)
      setError("Could not log out. Please try again.")
    }
  }

  return (
    <main>
      <h1>Hello World</h1>
      {error && <p>{error}</p>}
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  )
}
