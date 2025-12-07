import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { Loader2 } from "lucide-react"
import cn from "../../utils/cn"

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void
  isLoading?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary"
}

export default function Button({
  type = "submit",
  onClick,
  isLoading = false,
  disabled = false,
  className,
  variant = "primary",
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "cursor-pointer rounded-lg px-6 py-3 text-neutral-50 focus:outline-none focus-visible:ring-2 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400 disabled:hover:bg-indigo-600":
            variant === "primary",
          "border border-neutral-500 bg-transparent hover:bg-neutral-800 focus:ring-neutral-500 disabled:hover:bg-transparent":
            variant === "secondary",
        },
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" aria-label="Loading..." />
      ) : (
        children
      )}
    </button>
  )
}
