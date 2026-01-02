import { GoogleLogin } from "@react-oauth/google"
import { auth } from "~/services/auth-service"

export default function Home() {
  return (
    <div className="page bg-neutral-700">
      <h1 className="text-3xl text-white">Hello World</h1>
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) return
          await auth(res.credential)
        }}
      />
    </div>
  )
}
