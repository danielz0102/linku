import { Link } from "react-router"
import { LoginForm } from "~/auth/components/login-form"

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Welcome back</h1>
          <p className="text-neutral-400">Pick up the conversation.</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-neutral-400">
          New to Linku?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
