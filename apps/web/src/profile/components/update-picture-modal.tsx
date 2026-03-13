import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

import { useAuth, useUser } from "~/auth/context/auth-context"
import { PrimaryButton } from "~/shared/components/primary-button"

import { updateUser } from "../services/update-user"
import { uploadProfileImage } from "../services/upload-profile-image"
import { ImagePicker } from "./image-picker/image-picker"

type UpdatePictureModalProps = {
  ref: React.RefObject<HTMLDialogElement | null>
}

export function UpdatePictureModal({ ref }: UpdatePictureModalProps) {
  const { profilePicUrl } = useUser()
  const { refresh } = useAuth()
  const [file, setFile] = useState<File | null>(null)

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (image: File) => {
      const uploadedPicture = await uploadProfileImage(image)
      await updateUser({ profilePicUrl: uploadedPicture })
      await refresh()
    },
    onSuccess: () => ref.current?.close(),
  })

  return (
    <dialog
      ref={ref}
      className="absolute top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-2xl bg-slate-900 p-4 text-white backdrop:bg-black/70"
    >
      <h2 className="text-center text-lg font-semibold">Update picture</h2>

      <ImagePicker defaultImage={profilePicUrl} onChange={setFile} />
      {error && (
        <p className="text-sm text-red-400" role="alert">
          Failed to update profile picture. Please try again.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="w-full cursor-pointer rounded-full border border-neutral-600 py-2 transition-colors hover:bg-neutral-800"
        >
          Cancel
        </button>

        <PrimaryButton
          loading={isPending}
          onClick={() => {
            if (file) {
              mutate(file)
            } else {
              ref.current?.close()
            }
          }}
        >
          Confirm
        </PrimaryButton>
      </div>
    </dialog>
  )
}
