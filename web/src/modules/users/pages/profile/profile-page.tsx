import { useRef } from "react"

import { Dialog } from "~/shared/components/dialog"
import { ProfileAvatar } from "~/shared/components/profile-avatar"
import { uploadFile } from "~/shared/upload-file"

import { useAuthenticatedUser } from "../../context/user-context"
import { User } from "../../domain/user"
import { getProfilePictureUploadSignature } from "./api/get-cloudinary-signature"
import { updateProfilePicture } from "./api/update-profile-picture"
import { updateUser } from "./api/update-user"
import { ProfileCard } from "./components/profile-card"
import { UpdateProfilePictureForm } from "./components/update-profile-picture-form"
import { UpdateUserForm } from "./components/update-user-form"

export default function ProfilePage() {
  const { user, setUser } = useAuthenticatedUser()
  const editProfileDlgRef = useRef<HTMLDialogElement>(null)
  const updateProfilePictureDlgRef = useRef<HTMLDialogElement>(null)

  const handleProfileUpdate: React.ComponentProps<typeof UpdateUserForm>["onSubmit"] = async (
    data
  ) => {
    const updatedUser = await updateUser(data)

    if (!updatedUser) {
      return false
    }

    setUser(updatedUser)
    editProfileDlgRef.current?.close()
    return true
  }

  const handlePictureSubmit: (file: File) => Promise<void> = async (file) => {
    const uploadSignature = await getProfilePictureUploadSignature()
    const { url, public_id } = await uploadFile(file, uploadSignature)

    await updateProfilePicture({ publicId: public_id, publicUrl: url })

    const updatedUser = new User({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: url,
      bio: user.bio,
    })

    setUser(updatedUser)
    updateProfilePictureDlgRef.current?.close()
  }

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
          onSubmit={handleProfileUpdate}
        />
      </Dialog>

      <Dialog ref={updateProfilePictureDlgRef}>
        <h2 className="title">Update Profile Picture</h2>
        <UpdateProfilePictureForm
          currentImageUrl={user.profilePictureUrl ?? undefined}
          initials={user.initials}
          onSubmit={handlePictureSubmit}
        />
      </Dialog>
    </main>
  )
}
