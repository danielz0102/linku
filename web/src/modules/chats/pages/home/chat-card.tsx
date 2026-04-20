import { ProfileAvatar } from "~/shared/components/profile-avatar"

import type { Chat } from "../../domain/chat"

type ChatCardProps = {
  chat: Chat
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <article className="flex gap-4 p-3">
      <ProfileAvatar
        initials={chat.initials}
        avatarUrl={chat.imageUrl}
        className="shrink-0 text-xs"
        size="sm"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="truncate font-medium">{chat.name}</h3>
          <div className="flex gap-2">
            <time
              className="text-muted text-xs whitespace-nowrap"
              dateTime={chat.time.toISOString()}
            >
              {chat.time.format()}
            </time>
            {!chat.lastMessage.isRead && <span className="bg-primary mt-1 size-2 rounded-full" />}
          </div>
        </div>

        <p
          className="text-muted truncate text-sm data-attachment:italic"
          data-attachment={chat.lastMessage.isAttachment || undefined}
        >
          {chat.lastMessage.preview}
        </p>
      </div>
    </article>
  )
}
