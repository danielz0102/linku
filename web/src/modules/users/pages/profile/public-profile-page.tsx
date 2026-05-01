import { IconSendFilled } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"

import { ProfileAvatar } from "~/shared/components/profile-avatar"

import { getUser } from "./api/get-user"
import { ProfileCard } from "./components/profile-card"

export default function PublicProfilePage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Username is required")
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      return getUser(username)
    },
  })

  return (
    <main className="flex size-full items-center justify-center">
      {isLoading && <p className="text-muted animate-pulse">Loading...</p>}

      {!user && !isLoading && (
        <div className="space-y-1 text-center">
          <h1 className="title">It seems this user doesn't exist.</h1>
          <Link to="/search" className="link underline">
            Search for friends
          </Link>
        </div>
      )}

      {user && (
        <ProfileCard
          user={user}
          Avatar={
            <ProfileAvatar
              initials={user.initials}
              avatarUrl={user.profilePictureUrl ?? undefined}
            />
          }
        >
          <Link to={`/chat/${user.username}`} className="button rounded-xl">
            Send a message
            <IconSendFilled />
          </Link>
        </ProfileCard>
      )}
    </main>
  )
}
