import { use } from "react"
import { Navigate } from "react-router"

import { Layout } from "~/app/layout"
import { api } from "~/shared/api/api"

import { useUser } from "../context/user-context"

const me = api.users.whoami()

export function ProtectedLayout() {
  const user = use(me)
  const { setUser } = useUser()

  if (!user) {
    setUser(undefined)
    return <Navigate to="/log-in" replace />
  }

  return <Layout />
}
