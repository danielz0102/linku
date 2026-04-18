import { useRef } from "react"

import { api } from "~/shared/api/api"
import { Dialog } from "~/shared/components/dialog"

import { useAuthenticatedUser, useUser } from "../../context/user-context"
import { ProfileCard } from "./profile-card"
import { UpdateUserForm } from "./update-user-form"

export default function ProfilePage() {
  const user = useAuthenticatedUser()
  const dlgRef = useRef<HTMLDialogElement>(null)
  const { setUser } = useUser()

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
          onSubmit={async (data) => {
            const updatedUser = await api.users.updateUser({
              ...data,
              profilePictureUrl: user.profilePictureUrl ?? null,
            })

            if (!updatedUser) {
              return false
            }

            setUser(updatedUser)
            dlgRef.current?.close()
            return true
          }}
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
