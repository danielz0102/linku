import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"
import { Loader2 } from "lucide-react"

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void
  isLoading?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  disabled?: boolean
  className?: string
}

export default function Button({
  type = "submit",
  onClick,
  isLoading,
  disabled,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={twMerge(
        "rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600",
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
