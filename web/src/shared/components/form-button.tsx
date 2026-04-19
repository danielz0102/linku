import { twMerge } from "tailwind-merge"

type FormButtonProps = React.PropsWithChildren<{
  className?: string
  loading?: boolean
}>

export function FormButton({ className, children, loading = false }: FormButtonProps) {
  return (
    <button type="submit" className={twMerge("button w-full", className)} disabled={loading}>
      {loading ? "Loading..." : children}
    </button>
  )
}
