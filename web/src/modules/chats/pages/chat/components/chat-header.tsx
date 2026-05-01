import { Link } from "react-router"

import { ProfileAvatar } from "~/shared/components/profile-avatar"

type ChatHeaderProps = {
  username: string
  name: string
  initials: string
  avatarUrl?: string
}

export function ChatHeader(props: ChatHeaderProps) {
  return (
    <header className="bg-background flex items-center gap-3 pb-3 pl-3">
      <Link to={`/profile/${props.username}`} aria-label={`View ${props.name} profile`}>
        <ProfileAvatar initials={props.initials} avatarUrl={props.avatarUrl} size="sm" />
      </Link>

      <h1 className="truncate text-lg font-semibold">{props.name}</h1>
    </header>
  )
}
