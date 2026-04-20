import { useUser } from "../context/user-context"
import { Layout, type LayoutProps } from "./layout"

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
