import type React from "react"

import { House, LogOut, Search, User } from "lucide-react"
import { Link, useLocation } from "react-router"

import { cn } from "~/lib/cn"
import { useAuth } from "~/shared/context/auth-context"

type NavigationProps = {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { logout } = useAuth()

  return (
    <nav
      className={cn(
        "border-t border-slate-950 bg-slate-800 p-4 md:border-t-0 md:border-r",
        className
      )}
    >
      <ul className="flex items-center justify-center gap-6 md:flex-col md:gap-4">
        <NavItemLink to="/" Icon={House}>
          Home
        </NavItemLink>

        <NavItemLink to="/search-users" Icon={Search}>
          Search Users
        </NavItemLink>

        <NavItemLink to="/profile" Icon={User}>
          Profile
        </NavItemLink>

        <NavItemButton onClick={logout} Icon={LogOut}>
          Log out
        </NavItemButton>
      </ul>
    </nav>
  )
}

type NavItemButtonProps = React.PropsWithChildren<{
  onClick: () => void
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}>

function NavItemButton({ onClick, Icon, children }: NavItemButtonProps) {
  return (
    <li className="p-2 text-sm md:w-full">
      <button
        onClick={onClick}
        className="flex cursor-pointer items-center justify-center md:gap-2"
      >
        <Icon strokeWidth={1.5} />
        <span className="sr-only md:not-sr-only">{children}</span>
      </button>
    </li>
  )
}

type NavItemLinkProps = React.PropsWithChildren<{
  to: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}>

function NavItemLink({ to, Icon, children }: NavItemLinkProps) {
  const { pathname } = useLocation()

  return (
    <li
      className={cn("p-2 text-sm md:w-full", {
        "rounded-lg bg-slate-700": pathname === to,
      })}
    >
      <Link to={to} className="md:flex md:items-center md:gap-2">
        <Icon strokeWidth={1.5} />
        <span className="sr-only md:not-sr-only">{children}</span>
      </Link>
    </li>
  )
}
