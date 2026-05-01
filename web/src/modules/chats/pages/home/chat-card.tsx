import { ProfileAvatar } from "~/shared/components/profile-avatar"

import { type ChatMember } from "../../domain/chat-member"
import { formatMessageDate } from "../../domain/message"

type ChatCardProps = {
  user: ChatMember
  data: {
    date: Date
    isRead?: boolean
    text?: string
  }
}

export function ChatCard({ user, data: { date, text, isRead = false } }: ChatCardProps) {
  return (
    <article className="flex gap-4 p-3">
      <ProfileAvatar
        initials={user.initials}
        avatarUrl={user.profilePicURL}
        className="shrink-0 text-xs"
        size="sm"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between">
          <h2 className="truncate font-medium">{user.fullname}</h2>
          <div className="flex gap-2">
            <time className="text-muted text-xs whitespace-nowrap" dateTime={date.toISOString()}>
              {formatMessageDate(date)}
            </time>
            {!isRead && <span className="bg-primary mt-1 size-2 rounded-full" />}
          </div>
        </div>

        <p
          className="text-muted truncate text-sm data-is-attachment:italic"
          data-is-attachment={text === undefined || undefined}
        >
          {text || "Attachment"}
        </p>
      </div>
    </article>
  )
}
