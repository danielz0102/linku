import { Link } from "react-router"

import type { ChatMember } from "~/modules/chats/domain/chat-member"
import { ProfileAvatar } from "~/shared/components/profile-avatar"

type ChatHeaderProps = {
  member: ChatMember
}

export function ChatHeader({ member }: ChatHeaderProps) {
  return (
    <header className="bg-background flex items-center gap-3 p-3">
      <Link to={`/profile/${member.username}`} aria-label={`View ${member.name} profile`}>
        <ProfileAvatar
          initials={member.initials}
          avatarUrl={member.profilePictureUrl ?? undefined}
          size="sm"
        />
      </Link>

      <h1 className="truncate text-lg font-semibold">{member.name}</h1>
    </header>
  )
}
