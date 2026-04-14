import { Link, useNavigate } from "react-router"

import { createUser } from "./create-user-service"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  const navigate = useNavigate()

  return (
    <main className="flex size-full flex-col items-center justify-center">
      <div className="bg-surface shadow-foreground/10 space-y-4 rounded-lg px-8 py-8 shadow md:px-16">
        <h1 className="title text-center">Create your account</h1>
        <SignUpForm
          onSubmit={async () => {
            await navigate("/")
          }}
          createUser={createUser}
        />
        <p className="text-foreground/70 text-center text-sm">
          Already have an account?{" "}
          <Link to="/log-in" className="link">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
