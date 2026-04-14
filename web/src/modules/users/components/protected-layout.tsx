import { Navigate } from "react-router"

import { useAuth } from "~/modules/users/context/auth-context"
import { Layout } from "~/shared/components/layout"

export function ProtectedLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/log-in" replace />
  }

  return <Layout />
}
