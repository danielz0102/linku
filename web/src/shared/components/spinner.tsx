import { twMerge } from "tailwind-merge"

type SpinnerProps = {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={twMerge("flex size-full items-center justify-center", className)}>
      <div
        role="status"
        aria-label="Loading"
        className="border-border border-t-primary size-8 animate-spin rounded-full border-4"
      />
    </div>
  )
}
