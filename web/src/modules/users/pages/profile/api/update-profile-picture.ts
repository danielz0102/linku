import { API_URL } from "~/env"

type UpdateProfilePictureCommand = {
  publicId: string
  publicUrl: string
}

export async function updateProfilePicture(cmd: UpdateProfilePictureCommand): Promise<void> {
  const res = await fetch(`${API_URL}/users/me/profile-picture`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to update profile picture", {
      cause: { status: res.status },
    })
  }
}
