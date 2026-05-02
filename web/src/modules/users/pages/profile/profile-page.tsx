import { useRef } from "react"

import { Dialog } from "~/shared/components/dialog"
import { ProfileAvatar } from "~/shared/components/profile-avatar"
import { uploadFile } from "~/shared/upload-file"

import { useAuthenticatedUser } from "../../context/user-context"
import { getProfilePictureUploadSignature } from "./api/get-cloudinary-signature"
import { updateUser } from "./api/update-user"
import { ProfileCard } from "./components/profile-card"
import { UpdateProfilePictureForm } from "./components/update-profile-picture-form"
import { UpdateUserForm } from "./components/update-user-form"

export default function ProfilePage() {
  const { user, setUser } = useAuthenticatedUser()
  const editProfileDlgRef = useRef<HTMLDialogElement>(null)
  const updateProfilePictureDlgRef = useRef<HTMLDialogElement>(null)

  return (
    <main className="flex size-full items-center justify-center">
      <ProfileCard
        user={user}
        Avatar={
          <ProfileAvatar initials={user.initials} avatarUrl={user.profilePictureUrl ?? undefined}>
            <ProfileAvatar.EditButton
              onClick={() => {
                updateProfilePictureDlgRef.current?.showModal()
              }}
            />
          </ProfileAvatar>
        }
      >
        <ProfileCard.Action
          onClick={() => {
            editProfileDlgRef.current?.showModal()
          }}
        >
          Edit Profile
        </ProfileCard.Action>
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
            const updatedUser = await updateUser({
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
          initials={user.initials}
          onSubmit={async (file) => {
            const uploadSignature = await getProfilePictureUploadSignature()
            const { url } = await uploadFile(file, uploadSignature)

            const updatedUser = await updateUser({
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              bio: user.bio,
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
