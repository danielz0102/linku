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

  const { data: user } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      return getUser(username)
    },
  })

  return (
    <main className="flex size-full items-center justify-center">
      {!user ? (
        <p className="text-muted animate-pulse">Loading...</p>
      ) : (
        <ProfileCard
          data={{
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
          }}
          Avatar={
            <ProfileAvatar
              firstName={user.firstName}
              lastName={user.lastName}
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
