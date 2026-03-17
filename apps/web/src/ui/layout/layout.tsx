import { Outlet } from "react-router"

import { Navigation } from "~/ui/layout/navigation"

export function Layout() {
  return (
    <div className="flex h-dvh flex-col md:flex-row-reverse [&>main]:flex-1 md:[&>main]:flex-4">
      <Outlet />
      <Navigation className="md:flex-1" />
    </div>
  )
}
