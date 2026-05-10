import { Children, useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"

type MessageListProps = React.PropsWithChildren<{
  onEndReached: () => void
  className?: string
  isLoading?: boolean
}>

export function MessageList({
  className,
  isLoading = false,
  children,
  onEndReached,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isEmpty = children && Children.toArray(children).length === 0

  useEffect(() => {
    const container = containerRef.current
    const sentinel = sentinelRef.current

    if (!container || !sentinel || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onEndReached()
        }
      },
      { root: container, threshold: 0.1 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  })

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "flex flex-col-reverse gap-2 overflow-y-auto p-4",
        (isLoading || isEmpty) && "grid place-items-center",
        className
      )}
    >
      <p role="status" className={`text-muted m-auto ${isLoading && "animate-pulse"}`}>
        {isLoading && "Loading chat..."}
        {isEmpty && "No messages yet. Say hi 👋"}
      </p>

      {children}
      <div ref={sentinelRef} />
    </div>
  )
}
