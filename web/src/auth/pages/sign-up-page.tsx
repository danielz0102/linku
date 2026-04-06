import { Link, useNavigate } from "react-router"

import { SignUpForm } from "../ui/sign-up-form"

export default function SignUpPage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center justify-center size-full">
      <div className="bg-surface space-y-4 py-8 px-16 rounded-lg shadow shadow-foreground/10">
        <h1 className="title text-center">Create your account</h1>
        <SignUpForm
          onSubmit={() => {
            navigate("/")
          }}
        />
        <p className="text-center text-sm text-foreground/70">
          Already have an account?{" "}
          <Link to="/log-in" className="link">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
