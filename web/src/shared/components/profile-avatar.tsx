import { IconEdit } from "@tabler/icons-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

type ProfileAvatarProps = React.PropsWithChildren<{
  initials: string
  avatarUrl?: string
  className?: string
  size?: "sm" | "lg"
}>

export function ProfileAvatar({
  avatarUrl,
  initials,
  className,
  size = "lg",
  children,
}: ProfileAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showFallback = !avatarUrl || hasImageError

  return (
    <div
      className={twMerge("relative size-28 data-[size=sm]:size-12 group", className)}
      data-size={size}
    >
      <div className="bg-primary/10 text-primary size-full overflow-hidden rounded-full text-3xl font-bold">
        {showFallback ? (
          <span className="grid size-full place-content-center group-data-[size=sm]:text-sm">
            {initials}
          </span>
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
