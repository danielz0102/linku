import { useAuthenticatedUser } from "../../context/user-context"
import { ProfileCard } from "./profile-card"

export default function ProfilePage() {
  const user = useAuthenticatedUser()

  return (
    <main className="flex size-full items-center justify-center">
      <ProfileCard
        avatarUrl={user.profilePictureUrl ?? undefined}
        username={user.username}
        firstName={user.firstName}
        lastName={user.lastName}
        bio={user.bio}
      />
    </main>
  )
}
