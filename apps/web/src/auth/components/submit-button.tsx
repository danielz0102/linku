import { LoadingSpinner } from "~/shared/components/loading-spinner"

export function SubmitButton({ loading = false, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 focus-visible:outline-none active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  )
}

type SubmitButtonProps = React.PropsWithChildren<{ loading?: boolean }>
