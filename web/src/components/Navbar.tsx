import {
  IconMessage,
  IconMessageFilled,
  IconUser,
  IconUserFilled,
  type Icon,
} from "@tabler/icons-react"
import type { PropsWithChildren } from "react"
import { Link, useLocation } from "react-router"

export default function Navbar() {
  return (
    <nav className="bg-light flex p-4 *:flex-1">
      <NavItem to="/" icon={IconMessage} activeIcon={IconMessageFilled}>
        Messages
      </NavItem>
      <NavItem to="/profile" icon={IconUser} activeIcon={IconUserFilled}>
        Profile
      </NavItem>
    </nav>
  )
}

type NavItemProps = PropsWithChildren & {
  to: string
  icon: Icon
  activeIcon?: Icon
}

function NavItem({ to, icon, activeIcon, children }: NavItemProps) {
  const { pathname } = useLocation()
  const isActive = pathname === to
  const CurrentIcon = isActive && activeIcon ? activeIcon : icon

  return (
    <Link
      to={to}
      className="center not-data-active:text-secondary gap-1 text-sm"
      data-active={isActive || undefined}
    >
      <CurrentIcon stroke={1} size={20} />
      {children}
    </Link>
  )
}
