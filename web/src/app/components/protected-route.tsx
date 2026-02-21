import { Navigate } from "react-router"
import { useAuth } from "~/users/context/auth-context"

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
