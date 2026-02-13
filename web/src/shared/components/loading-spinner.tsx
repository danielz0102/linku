type LoadingSpinnerProps = {
  fullScreen?: boolean
  size?: "sm" | "md"
}

export function LoadingSpinner({
  fullScreen = false,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      data-full-screen={fullScreen}
      className="inline-flex items-center justify-center data-[full-screen=true]:flex data-[full-screen=true]:min-h-screen"
    >
      <div
        data-size={size}
        role="status"
        aria-label="Loading..."
        className="animate-spin rounded-full border-current border-t-transparent data-[size=md]:size-8 data-[size=md]:border-2 data-[size=sm]:size-4 data-[size=sm]:border"
      />
    </div>
  )
}
