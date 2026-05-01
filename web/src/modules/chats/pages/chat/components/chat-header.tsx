import { Link } from "react-router"

import type { ChatMember } from "~/modules/chats/domain/chat-member"
import { ProfileAvatar } from "~/shared/components/profile-avatar"

type ChatHeaderProps = {
  user: ChatMember
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <header className="bg-background flex items-center gap-3 pb-3 pl-3">
      <Link to={`/profile/${user.username}`} aria-label={`View ${user.firstName} profile`}>
        <ProfileAvatar initials={user.initials} avatarUrl={user.profilePicURL} size="sm" />
      </Link>

      <h1 className="truncate text-lg font-semibold">{user.fullname}</h1>
    </header>
  )
}
