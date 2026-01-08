import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "~/hooks/use-auth"

export default function Home() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  return (
    <div className="page bg-neutral-700">
      <h1 className="text-3xl text-white">Hello World</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
