import { useState, Activity } from "react"
import ToggleSwitch from "~/components/ui/ToggleSwitch"
import LoginForm from "~/pages/Login/components/forms/LoginForm"
import SignUpForm from "./components/forms/SignUpForm"
import OAuthButtons from "./components/OAuthButtons"
import Header from "./components/Header"

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  return (
    <div className="flex min-h-dvh flex-col items-center gap-4 bg-linear-to-br from-violet-950 via-slate-900 to-slate-950 p-8">
      <Header />
      <main className="flex flex-col gap-8 rounded-2xl border border-neutral-700/50 bg-neutral-800/50 p-8 shadow-2xl backdrop-blur-sm md:min-w-md">
        <ToggleSwitch textOff="Login" textOn="Sign Up" onChange={setIsSignUp} />
        <Activity mode={isSignUp ? "hidden" : "visible"}>
          <LoginForm />
        </Activity>
        <Activity mode={isSignUp ? "visible" : "hidden"}>
          <SignUpForm />
        </Activity>
        <OAuthButtons />
      </main>
    </div>
  )
}
