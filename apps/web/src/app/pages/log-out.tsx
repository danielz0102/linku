import { useEffect } from "react"
import { Navigate } from "react-router"

import { useAuth } from "~/shared/context/auth-context"

export default function LogOutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    void logout()
  }, [logout])

  return <Navigate to="/login" replace />
}
