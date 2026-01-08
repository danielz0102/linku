import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router"
import { useAuth } from "~/hooks/use-auth"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return (
    <main className="page bg-primary">
      <h1 className="title mb-2">Linku</h1>
      <p className="text-secondary mb-4">Real-time messaging, simplified</p>
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
