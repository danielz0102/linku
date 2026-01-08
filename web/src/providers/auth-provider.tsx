import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useState, type PropsWithChildren } from "react"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env"
import AuthContext from "~/contexts/auth-context"
import {
  auth,
  getAccessToken,
  logout as logoutApi,
} from "~/services/auth-service"
import type { User, UserPayload } from "~/types"

const initialUser: User | undefined = await getAccessToken().then((token) => {
  if (!token) return
  return userTokenToUser(token)
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(initialUser)

  const login = async (tokenId: string) => {
    const { data } = await auth(tokenId)
    setUser(userTokenToUser(data.accessToken))
  }

  const logout = async () => {
    await logoutApi()
    setUser(undefined)
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <AuthContext value={{ user, login, logout }}>{children}</AuthContext>
    </GoogleOAuthProvider>
  )
}

function userTokenToUser(token: string): User {
  const payload = jwtDecode<UserPayload>(token)

  return {
    id: payload.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    picture: payload.picture,
  }
}
