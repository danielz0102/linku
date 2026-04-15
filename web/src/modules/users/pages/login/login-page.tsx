import { Link, useNavigate } from "react-router"

import { api } from "~/shared/api/api"

import { useUser } from "../../context/user-context"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useUser()

  return (
    <main className="flex size-full flex-col items-center justify-center">
      <div className="bg-surface shadow-foreground/10 space-y-4 rounded-lg px-16 py-8 shadow">
        <h1 className="title text-center">Welcome back!</h1>
        <LoginForm
          onSubmit={async () => {
            const user = await api.users.whoami()
            setUser(user)
            await navigate("/")
          }}
          login={api.users.login}
        />
        <p className="text-foreground/70 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/sign-up" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
