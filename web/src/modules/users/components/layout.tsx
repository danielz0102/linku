import { IconHome, IconLogout, IconMenu2, IconUserCircle } from "@tabler/icons-react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router"

import { api } from "~/shared/api/api"
import { Sidebar } from "~/shared/components/sidebar"

import { useUser } from "../context/user-context"

export type LayoutProps = React.PropsWithChildren

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { setUser } = useUser()

  return (
    <div className="flex size-full">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <Sidebar.Link Icon={IconHome} to="/" current={pathname === "/"}>
          Home
        </Sidebar.Link>
        <Sidebar.Link Icon={IconUserCircle} to="/profile" current={pathname === "/profile"}>
          Profile
        </Sidebar.Link>
        <Sidebar.Button
          Icon={IconLogout}
          onClick={async () => {
            await api.users.logOut()
            setUser(undefined)
            await navigate("/log-in")
          }}
        >
          Log out
        </Sidebar.Button>
      </Sidebar>

      <div className="bg-background flex flex-1 flex-col gap-4 p-4">
        <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
          <IconMenu2 strokeWidth={1.5} aria-label="Open menu" size={16} />
        </button>

        {children}
      </div>
    </div>
  )
}
