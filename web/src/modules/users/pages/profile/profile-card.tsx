import { useState } from "react"

type ProfileCardProps = React.PropsWithChildren<{
  avatarUrl?: string
  username: string
  firstName: string
  lastName: string
  bio: string | null
}>

export function ProfileCard({
  avatarUrl,
  username,
  firstName,
  lastName,
  bio,
  children,
}: ProfileCardProps) {
  return (
    <section className="bg-surface shadow-foreground/10 w-full max-w-2xl space-y-4 rounded-xl p-6 shadow">
      <h1 className="title text-center md:text-left">{`${firstName} ${lastName}`}</h1>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <ProfileAvatar avatarUrl={avatarUrl} firstName={firstName} lastName={lastName} />

        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-muted max-w-prose">
            {bio ? bio : <span className="italic">No bio available</span>}
          </p>
        </div>
        {children}
      </div>
    </section>
  )
}

ProfileCard.EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="button ml-auto self-end rounded-xl" onClick={onClick}>
      Edit Profile
    </button>
  )
}

type ProfileAvatarProps = {
  avatarUrl?: string
  firstName: string
  lastName: string
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function ProfileAvatar({ avatarUrl, firstName, lastName }: ProfileAvatarProps) {
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
