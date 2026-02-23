import { House, LogOut, User } from "lucide-react"
import { Link, useLocation } from "react-router"
import { useAuth } from "~/auth/context/auth-context"
import { cn } from "../utils/cn"

type NavigationProps = {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <nav
      className={cn(
        "border-t border-slate-950 bg-slate-800 p-4 md:border-t-0 md:border-r",
        className
      )}
    >
      <ul className="flex items-center justify-center gap-6 md:flex-col md:gap-4">
        <NavItem isActive={pathname === "/"}>
          <Link to="/" className="md:flex md:items-center md:gap-2">
            <House strokeWidth={1.5} />
            <span className="sr-only md:not-sr-only">Home</span>
          </Link>
        </NavItem>

        <NavItem isActive={pathname === "/profile"}>
          <Link to="/profile" className="md:flex md:items-center md:gap-2">
            <User strokeWidth={1.5} />
            <span className="sr-only md:not-sr-only">Profile</span>
          </Link>
        </NavItem>

        <NavItem>
          <button
            onClick={logout}
            className="flex cursor-pointer items-center justify-center md:gap-2"
          >
            <LogOut strokeWidth={1.5} />
            <span className="sr-only md:not-sr-only">Log out</span>
          </button>
        </NavItem>
      </ul>
    </nav>
  )
}

type NavItemProps = React.PropsWithChildren<{
  isActive?: boolean
}>

function NavItem({ children, isActive = false }: NavItemProps) {
  return (
    <li
      className="p-2 text-sm data-active:rounded-lg data-active:bg-slate-700 md:w-full"
      data-active={isActive ? "true" : undefined}
    >
      {children}
    </li>
  )
}
