import { ProfileAvatar } from "~/shared/components/profile-avatar"

import { type ChatMember } from "../../domain/chat-member"
import { type Message } from "../../domain/message"

type ChatCardProps = {
  peer: ChatMember
  message: Message
  hasUnreads: boolean
}

export function ChatCard({ peer, message, hasUnreads }: ChatCardProps) {
  return (
    <article className="flex gap-4 p-3">
      <ProfileAvatar
        initials={peer.initials}
        avatarUrl={peer.profilePicURL}
        className="shrink-0 text-xs"
        size="sm"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between">
          <h2 className="truncate font-medium">{peer.fullname}</h2>
          <div className="flex gap-2">
            <time
              className="text-muted text-xs whitespace-nowrap"
              dateTime={message.sentAt.toISOString()}
            >
              {message.sentAt.format()}
            </time>
            {hasUnreads && <span className="bg-primary mt-1 size-2 rounded-full" />}
          </div>
        </div>

        <p
          className="text-muted truncate text-sm data-is-attachment:italic"
          data-is-attachment={message.isOnlyAttachment || undefined}
        >
          {message.text || "Attachment"}
        </p>
      </div>
    </article>
  )
}
