import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "~/hooks/use-auth"

export default function Home() {
  const { login, user } = useAuth()

  return (
    <div className="page bg-neutral-700">
      <h1 className="text-3xl text-white">Hello World</h1>
      {user ? (
        <p className="text-white">Welcome, {user.firstName}!</p>
      ) : (
        <GoogleLogin
          onSuccess={async (res) => {
            if (!res.credential) return
            await login(res.credential)
          }}
        />
      )}
    </div>
  )
}
