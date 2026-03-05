import type React from "react"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { cn } from "../utils/cn"

type SubmitButtonProps = React.PropsWithChildren<{
  loading?: boolean
}> &
  React.ComponentProps<"button">

export function PrimaryButton({
  children,
  className,
  type = "button",
  loading = false,
  ...rest
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={loading}
      className={cn(
        "w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 focus-visible:outline-none active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  )
}
