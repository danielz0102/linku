import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useState, type PropsWithChildren } from "react"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env"
import AuthContext from "~/contexts/auth-context"
import { AuthService } from "~/services/auth-service"
import type { User, UserPayload } from "~/types"

const initialUser = await AuthService.getAccessToken().then((token) => {
  if (!token) return
  return userTokenToUser(token)
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(initialUser)

  const login = async (code: string) => {
    const token = await AuthService.auth(code)
    setUser(userTokenToUser(token))
  }

  const logout = async () => {
    await AuthService.logout()
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
