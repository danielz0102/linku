import { twMerge } from "tailwind-merge"

type MessageListProps = React.PropsWithChildren<{
  onEndReached: () => void
  state: "empty" | "loading" | "filled"
  className?: string
}>

export function MessageList({ state, className, children, onEndReached }: MessageListProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 overflow-y-auto p-4",
        (state === "loading" || state === "empty") && "grid place-items-center",
        className
      )}
    >
      <p role="status" className={`text-muted m-auto ${state === "loading" && "animate-pulse"}`}>
        {state === "loading" && "Loading chat..."}
        {state === "empty" && "No messages yet. Say hi 👋"}
      </p>

      {children}
    </div>
  )
}
