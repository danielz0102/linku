import { useState } from "react"

type ProfileAvatarProps = {
  avatarUrl?: string
  firstName: string
  lastName: string
}

export function ProfileAvatar({ avatarUrl, firstName, lastName }: ProfileAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const initials = getInitials(firstName, lastName)
  const showFallback = !avatarUrl || hasImageError

  return (
    <div className="bg-primary/10 text-primary size-28 shrink-0 overflow-hidden rounded-full text-3xl font-bold">
      {showFallback ? (
        <span className="grid size-full place-content-center">{initials}</span>
      ) : (
        <img
          src={avatarUrl}
          alt=""
          className="size-full object-cover"
          onError={() => setHasImageError(true)}
        />
      )}
    </div>
  )
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
