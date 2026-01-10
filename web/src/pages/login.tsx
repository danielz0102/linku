import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router"
import GoogleIcon from "~/components/icons/google"
import { GOOGLE_STATE_SECRET } from "~/config/env"
import { useAuth } from "~/hooks/use-auth"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const loginGoogle = useGoogleLogin({
    flow: "auth-code",
    state: GOOGLE_STATE_SECRET,
    onSuccess: async (codeResponse) => {
      if (codeResponse.state !== GOOGLE_STATE_SECRET) {
        return
      }

      await login(codeResponse.code)
      navigate("/")
    },
  })

  return (
    <main className="page bg-primary">
      <h1 className="title mb-2">Linku</h1>
      <p className="text-secondary mb-4">Real-time messaging, simplified</p>
      <button
        onClick={() => loginGoogle()}
        className="bg-light flex cursor-pointer items-center rounded border border-gray-300 px-4 py-2 hover:opacity-75 active:opacity-50"
      >
        <GoogleIcon className="mr-2 inline h-5 w-5" />
        Continue with Google
      </button>
    </main>
  )
}
