import { Navigation } from "~/shared/layout/navigation"
import { Outlet } from "react-router"

export function Layout() {
  return (
    <div className="flex h-dvh flex-col md:flex-row-reverse">
      <div className="flex-1 p-4">
        <Outlet />
      </div>
      <Navigation />
    </div>
  )
}
