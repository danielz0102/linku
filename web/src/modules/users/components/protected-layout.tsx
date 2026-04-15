import { Layout, type LayoutProps } from "~/app/layout"

import { useUser } from "../context/user-context"

type ProtectedLayoutProps = LayoutProps & {
  redirectTo: React.ReactNode
}

export function ProtectedLayout({ redirectTo, children }: ProtectedLayoutProps) {
  const { user } = useUser()

  if (!user) {
    return <>{redirectTo}</>
  }

  return <Layout>{children}</Layout>
}
