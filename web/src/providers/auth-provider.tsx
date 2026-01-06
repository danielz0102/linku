import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useState, type PropsWithChildren } from "react"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env"
import AuthContext from "~/contexts/auth-context"
import { auth } from "~/services/auth-service"
import type { User, UserPayload } from "~/types"

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>()

  const login = async (tokenId: string) => {
    const { data } = await auth(tokenId)
    const decodedUser = jwtDecode<UserPayload>(data.accessToken)

    setUser({
      id: decodedUser.id,
      firstName: decodedUser.firstName,
      lastName: decodedUser.lastName,
      email: decodedUser.email,
      picture: decodedUser.picture,
    })
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <AuthContext value={{ user, login }}>{children}</AuthContext>
    </GoogleOAuthProvider>
  )
}
