type ChatCardProps = {
  imgUrl: string
  name: string
  lastMessage: string
  time: Date
  isRead?: boolean
}

export function ChatCard({ imgUrl, name, lastMessage, time, isRead = false }: ChatCardProps) {
  return (
    <article className="flex gap-4 p-3">
      <img src={imgUrl} alt="" className="size-12 rounded-full object-cover" />
      <div className="flex flex-1 flex-col">
        <h3 className="font-medium">{name}</h3>
        <p className="text-muted text-sm">{lastMessage}</p>
      </div>
      <div className="flex gap-2">
        <time className="text-muted text-xs" dateTime={time.toISOString()}>
          {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
          }).format(time)}
        </time>
        {!isRead && <span className="bg-primary mt-1 size-2 rounded-full" />}
      </div>
    </article>
  )
}
