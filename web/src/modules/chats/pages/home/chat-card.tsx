import { ProfileAvatar } from "~/shared/components/profile-avatar"

import type { Chat } from "../../domain/chat"

type ChatCardProps = {
  chat: Chat
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <article className="flex gap-4 truncate overflow-clip p-3">
      <ProfileAvatar
        initials={chat.initials}
        avatarUrl={chat.imageUrl}
        className="size-12 text-xs"
      />

      <div className="flex flex-1 flex-col">
        <h3 className="font-medium">{chat.name}</h3>
        <p
          className="text-muted text-sm data-attachment:italic"
          data-attachment={chat.lastMessage.isAttachment || undefined}
        >
          {chat.lastMessage.preview}
        </p>
      </div>
      <div className="flex gap-2">
        <time className="text-muted text-xs" dateTime={chat.time.toISOString()}>
          {chat.time.format()}
        </time>
        {!chat.lastMessage.isRead && <span className="bg-primary mt-1 size-2 rounded-full" />}
      </div>
    </article>
  )
}
