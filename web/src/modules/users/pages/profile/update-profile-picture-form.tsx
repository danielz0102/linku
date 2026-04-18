import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

import { ProfileAvatar } from "./profile-avatar"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

type UpdateProfilePictureFormProps = {
  currentImageUrl?: string
  firstName: string
  lastName: string
  onSubmit: (file: File) => Promise<void>
}

type UpdateProfilePictureInputs = {
  profilePicture: FileList
}

export function UpdateProfilePictureForm({
  currentImageUrl,
  firstName,
  lastName,
  onSubmit,
}: UpdateProfilePictureFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfilePictureInputs>()

  const pictureFile = watch("profilePicture")?.[0]
  const pictureUrl = pictureFile ? URL.createObjectURL(pictureFile) : currentImageUrl

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const file = data.profilePicture?.[0]

        if (!file) {
          throw new Error("No file selected")
        }

        await onSubmit(file)
      })}
    >
      <div className="grid place-items-center">
        <ProfileAvatar firstName={firstName} lastName={lastName} avatarUrl={pictureUrl} />
      </div>

      <FormField label="Profile Picture" error={errors.profilePicture?.message}>
        {(props) => (
          <>
            <input
              {...register("profilePicture", {
                required: "Please select an image",
                validate: (files) => {
                  const file = files?.[0]

                  if (!file) {
                    return "Please select an image"
                  }

                  return validateImageFile(file) ?? true
                },
              })}
              {...props}
              type="file"
              className="input"
              accept="image/jpeg,image/png,image/webp"
            />
            <span className="text-sm text-slate-600">
              Accepted formats: JPG, JPEG, PNG, WEBP (max 5MB)
            </span>
          </>
        )}
      </FormField>

      <button type="submit" className="button w-full" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Update Picture"}
      </button>
    </form>
  )
}

function validateImageFile(file: File): string | undefined {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and WEBP images are allowed"
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be 5MB or less"
  }
}
