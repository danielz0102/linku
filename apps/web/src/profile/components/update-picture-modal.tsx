import { useState } from "react"
import { useAuth, useUser } from "~/auth/context/auth-context"
import { ImagePicker } from "./image-picker/image-picker"
import { updateUser } from "../services/update-user"
import { uploadProfileImage } from "../services/upload-profile-image"

type UpdatePictureModalProps = {
  onClose(): void
}

export function UpdatePictureModal({ onClose }: UpdatePictureModalProps) {
  const user = useUser()
  const { refresh } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-slate-900 p-4">
        <h2 className="text-center text-lg font-semibold">Update picture</h2>

        <ImagePicker defaultImage={user.profilePicUrl} onChange={setFile} />
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-full border border-neutral-600 py-2 transition-colors hover:bg-neutral-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!file || isSubmitting}
            onClick={async () => {
              if (!file) {
                return
              }

              setSubmitting(true)
              setError(null)

              try {
                const profilePicUrl = await uploadProfileImage(file)
                await updateUser({ profilePicUrl })
                await refresh()
                onClose()
              } catch {
                setError("Failed to update profile picture. Please try again.")
              } finally {
                setSubmitting(false)
              }
            }}
            className="w-full cursor-pointer rounded-full bg-blue-600 py-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
