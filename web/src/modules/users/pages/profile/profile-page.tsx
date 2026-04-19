import { useRef } from "react"

import { api } from "~/shared/api/api"
import { Dialog } from "~/shared/components/dialog"

import { useAuthenticatedUser, useUser } from "../../context/user-context"
import { ProfileAvatar } from "./profile-avatar"
import { ProfileCard } from "./profile-card"
import { UpdateProfilePictureForm } from "./update-profile-picture-form"
import { UpdateUserForm } from "./update-user-form"
import { uploadImage } from "./upload-image"

export default function ProfilePage() {
  const user = useAuthenticatedUser()
  const editProfileDlgRef = useRef<HTMLDialogElement>(null)
  const updateProfilePictureDlgRef = useRef<HTMLDialogElement>(null)
  const { setUser } = useUser()

  return (
    <main className="flex size-full items-center justify-center">
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
          >
            <ProfileAvatar.EditButton
              onClick={() => {
                updateProfilePictureDlgRef.current?.showModal()
              }}
            />
          </ProfileAvatar>
        }
      >
        <ProfileCard.EditButton
          onClick={() => {
            editProfileDlgRef.current?.showModal()
          }}
        />
      </ProfileCard>

      <Dialog ref={editProfileDlgRef}>
        <h2 className="title">Edit Profile</h2>
        <UpdateUserForm
          initialData={{
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            bio: user.bio,
          }}
          onSubmit={async (data) => {
            const updatedUser = await api.users.updateUser({
              ...data,
              profilePictureUrl: user.profilePictureUrl ?? null,
            })

            if (!updatedUser) {
              return false
            }

            setUser(updatedUser)
            editProfileDlgRef.current?.close()
            return true
          }}
        />
      </Dialog>

      <Dialog ref={updateProfilePictureDlgRef}>
        <h2 className="title">Update Profile Picture</h2>
        <UpdateProfilePictureForm
          currentImageUrl={user.profilePictureUrl ?? undefined}
          firstName={user.firstName}
          lastName={user.lastName}
          onSubmit={async (file) => {
            const { url } = await uploadImage(file)
            const updatedUser = await api.users.updateUser({
              ...user,
              profilePictureUrl: url,
            })

            if (!updatedUser) {
              throw new Error("Failed to update user with new profile picture")
            }

            setUser(updatedUser)
            updateProfilePictureDlgRef.current?.close()
          }}
        />
      </Dialog>
    </main>
  )
}
