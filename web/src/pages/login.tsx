import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router"
import { useAuth } from "~/hooks/use-auth"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return (
    <main className="page bg-gray-100">
      <h1 className="mb-2 text-3xl text-neutral-950">Linku</h1>
      <p className="mb-4 text-neutral-700">Real-time messaging, simplified</p>
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) return
          await login(res.credential)
          navigate("/")
        }}
      />
    </main>
  )
}
