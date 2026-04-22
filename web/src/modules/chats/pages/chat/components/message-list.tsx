import { Children } from "react"
import { twMerge } from "tailwind-merge"

type MessageListProps = React.PropsWithChildren<{
  className?: string
}>

export function MessageList({ className, children }: MessageListProps) {
  const isLoading = children === undefined
  const isEmpty = children && Children.toArray(children).length === 0

  return (
    <div
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

      {Children.toArray(children).toReversed()}
    </div>
  )
}
