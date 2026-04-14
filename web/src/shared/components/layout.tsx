import { IconHome, IconLogout, IconMenu2, IconUserCircle } from "@tabler/icons-react"
import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"

import { Sidebar } from "./sidebar"

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex size-full">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <Sidebar.Link Icon={IconHome} to="/" current={pathname === "/"}>
          Home
        </Sidebar.Link>
        <Sidebar.Link Icon={IconUserCircle} to="/profile" current={pathname === "/profile"}>
          Profile
        </Sidebar.Link>
        <Sidebar.Button Icon={IconLogout} onClick={() => navigate("/log-in")}>
          Log out
        </Sidebar.Button>
      </Sidebar>

      <div className="bg-background flex flex-1 flex-col gap-4 p-4">
        <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
          <IconMenu2 strokeWidth={1.5} aria-label="Open menu" size={16} />
        </button>

        <Outlet />
      </div>
    </div>
  )
}
