import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { api } from "~/shared/api/api"
import { ProfileAvatar } from "~/shared/components/profile-avatar"

import { ProfileCard } from "./components/profile-card"

export default function PublicProfilePage() {
  const { username } = useParams()

  if (!username) {
    throw new Error("Username is required")
  }

  const { data: user } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      return api.users.get(username)
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
        />
      )}
    </main>
  )
}
