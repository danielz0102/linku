import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, type PropsWithChildren } from "react"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env"
import AuthContext from "~/contexts/auth-context"
import { auth, getAccessToken } from "~/services/auth-service"
import type { User, UserPayload } from "~/types"

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>()

  const updateUser = (accessToken: string) => {
    const decodedUser = jwtDecode<UserPayload>(accessToken)

    setUser({
      id: decodedUser.id,
      firstName: decodedUser.firstName,
      lastName: decodedUser.lastName,
      email: decodedUser.email,
      picture: decodedUser.picture,
    })
  }

  const login = async (tokenId: string) => {
    const { data } = await auth(tokenId)
    updateUser(data.accessToken)
  }

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return
      updateUser(token)
    })
  }, [])

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <AuthContext value={{ user, login }}>{children}</AuthContext>
    </GoogleOAuthProvider>
  )
}
