import type { PropsWithChildren } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env"

export default function AuthProvider({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
}
