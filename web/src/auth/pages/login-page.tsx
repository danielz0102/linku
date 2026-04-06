import { Link } from "react-router"
import { useNavigate } from "react-router"

import { LoginForm } from "../ui/login-form"

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center justify-center size-full">
      <div className="bg-surface space-y-4 py-8 px-16 rounded-lg shadow shadow-foreground/10">
        <h1 className="title text-center">Welcome back!</h1>
        <LoginForm
          onSubmit={() => {
            navigate("/")
          }}
        />
        <p className="text-center text-sm text-foreground/70">
          Don't have an account?{" "}
          <Link to="/sign-up" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
