import { House, LogOut, Search, User } from "lucide-react"
import { Link, useLocation } from "react-router"

import { cn } from "~/lib/cn"

const links = [
  {
    to: "/",
    Icon: House,
    label: "Home",
  },
  {
    to: "/search-users",
    Icon: Search,
    label: "Search Users",
  },
  {
    to: "/profile",
    Icon: User,
    label: "Profile",
  },
  {
    to: "/log-out",
    Icon: LogOut,
    label: "Log out",
  },
] as const

export function Navigation({ className }: { className?: string }) {
  const { pathname } = useLocation()

  return (
    <nav
      className={cn(
        "border-t border-slate-950 bg-slate-800 p-4 md:border-t-0 md:border-r",
        className
      )}
    >
      <ul className="flex items-center justify-center gap-6 md:flex-col md:gap-4">
        {links.map(({ to, label, Icon }) => {
          return (
            <li
              key={to}
              className="p-2 text-sm data-active:rounded-lg data-active:bg-slate-700 md:w-full"
              data-active={pathname === to || undefined}
            >
              <Link to={to} className="md:flex md:items-center md:gap-2">
                <Icon strokeWidth={1.5} />
                <span className="sr-only md:not-sr-only">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
