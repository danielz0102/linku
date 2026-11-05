import { useUser } from "../context/user-context"

type GuestLayoutProps = React.PropsWithChildren<{
  redirectTo: React.ReactNode
}>

export function GuestLayout({ redirectTo, children }: GuestLayoutProps) {
  const { user } = useUser()

  if (user) {
    return <>{redirectTo}</>
  }

  return <>{children}</>
}
