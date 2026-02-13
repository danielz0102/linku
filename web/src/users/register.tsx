import { Link } from "react-router"
import { RegistrationForm } from "~/users/components/registration-form"

export default function Register() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Join Linku</h1>
          <p className="text-neutral-400">Connect with friends instantly.</p>
        </div>

        <RegistrationForm />

        <p className="text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Log In
          </Link>
        </p>
      </div>
    </main>
  )
}
