import { Navigate } from "react-router"

import { Layout } from "~/app/layout"
import { useAuth } from "~/modules/users/context/auth-context"

export function ProtectedLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/log-in" replace />
  }

  return <Layout />
}
