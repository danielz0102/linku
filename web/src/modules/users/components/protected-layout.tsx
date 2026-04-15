import { Navigate } from "react-router"

import { Layout } from "~/app/layout"

import { useUser } from "../context/user-context"

export function ProtectedLayout() {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/log-in" replace />
  }

  return <Layout />
}
