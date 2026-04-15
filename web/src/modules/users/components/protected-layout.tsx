import { Layout } from "~/app/layout"

import { useUser } from "../context/user-context"

export function ProtectedLayout({
  redirectTo,
  children,
}: React.PropsWithChildren<{ redirectTo: React.ReactNode }>) {
  const { user } = useUser()

  if (!user) {
    return <>{redirectTo}</>
  }

  return <Layout>{children}</Layout>
}
