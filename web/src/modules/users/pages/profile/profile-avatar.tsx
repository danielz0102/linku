import { IconEdit } from "@tabler/icons-react"
import { useState } from "react"

type ProfileAvatarProps = React.PropsWithChildren<{
  avatarUrl?: string
  firstName: string
  lastName: string
}>

export function ProfileAvatar({ avatarUrl, firstName, lastName, children }: ProfileAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const initials = getInitials(firstName, lastName)
  const showFallback = !avatarUrl || hasImageError

  return (
    <div className="bg-primary/10 text-primary relative size-28 shrink-0 rounded-full text-3xl font-bold">
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
      {children}
    </div>
  )
}

ProfileAvatar.EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-primary hover:bg-primary/80 text-background absolute right-0 bottom-1 grid size-8 cursor-pointer place-content-center rounded-full"
      onClick={onClick}
    >
      <IconEdit size={18} />
    </button>
  )
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
