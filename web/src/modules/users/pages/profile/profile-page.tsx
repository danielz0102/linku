import { useRef } from "react"

import { Dialog } from "~/shared/components/dialog"

import { useAuthenticatedUser } from "../../context/user-context"
import { ProfileCard } from "./profile-card"
import { UpdateUserForm } from "./update-user-form"

export default function ProfilePage() {
  const user = useAuthenticatedUser()
  const dlgRef = useRef<HTMLDialogElement>(null)

  return (
    <main className="flex size-full items-center justify-center">
      <ProfileCard
        avatarUrl={user.profilePictureUrl ?? undefined}
        username={user.username}
        firstName={user.firstName}
        lastName={user.lastName}
        bio={user.bio}
      >
        <ProfileCard.EditButton
          onClick={() => {
            dlgRef.current?.showModal()
          }}
        />
      </ProfileCard>

      <Dialog ref={dlgRef}>
        <h2 className="title">Edit Profile</h2>
        <UpdateUserForm
          initialData={{
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            bio: user.bio,
          }}
        />
      </Dialog>
    </main>
  )
}
