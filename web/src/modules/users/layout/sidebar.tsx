import { IconArrowForwardUp } from "@tabler/icons-react"
import { Children } from "react"
import { Link } from "react-router"

type SidebarProps = React.PropsWithChildren<{
  onClose: () => void
  open?: boolean
}>

export function Sidebar({ onClose, children, open = false }: SidebarProps) {
  return (
    <nav
      className="bg-sidebar absolute top-0 left-0 z-10 hidden h-svh w-full flex-col p-4 data-open:flex md:static md:block md:max-w-xs"
      data-open={open || undefined}
    >
      <ul className="flex flex-col gap-1 font-medium" onClickCapture={onClose}>
        {Children.toArray(children).map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
      <div className="relative flex-1">
        <button onClick={onClose} className="absolute right-0 bottom-0 md:hidden">
          <IconArrowForwardUp strokeWidth={1} size={32} aria-label="Close menu" />
        </button>
      </div>
    </nav>
  )
}

type SidebarLinkProps = React.PropsWithChildren<{
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>
  to: string
  current?: boolean
}>

Sidebar.Link = ({ Icon, to, children, current = false }: SidebarLinkProps) => {
  return (
    <Link to={to} className="nav-link" data-current={current || undefined}>
      <Icon strokeWidth={1.5} width={20} height={20} />
      {children}
    </Link>
  )
}

type SidebarButtonProps = React.PropsWithChildren<{
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>
  onClick: () => void
}>

Sidebar.Button = ({ Icon, onClick, children }: SidebarButtonProps) => {
  return (
    <button onClick={onClick} className="nav-link w-full cursor-pointer">
      <Icon strokeWidth={1.5} width={20} height={20} />
      {children}
    </button>
  )
}
