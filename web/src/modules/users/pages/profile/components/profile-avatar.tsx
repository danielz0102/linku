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
    <div className="relative size-28 shrink-0">
      <div className="bg-primary/10 text-primary size-full overflow-hidden rounded-full text-3xl font-bold">
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
      {children}
    </div>
  )
}

ProfileAvatar.EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-primary text-background absolute right-0 bottom-1 z-10 grid size-8 cursor-pointer place-content-center rounded-full border hover:bg-blue-600"
      onClick={onClick}
    >
      <IconEdit size={18} />
    </button>
  )
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
