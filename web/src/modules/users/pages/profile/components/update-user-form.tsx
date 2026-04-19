import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

type UpdateUserFormProps = {
  initialData: UpdateUserFormInputs
  onSubmit: (data: UpdateUserFormInputs) => Promise<boolean>
}

type UpdateUserFormInputs = {
  firstName: string
  lastName: string
  username: string
  bio: string | null
}

export function UpdateUserForm({ initialData, onSubmit }: UpdateUserFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<UpdateUserFormInputs>({
    defaultValues: initialData,
  })

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit(async (data) => {
        const success = await onSubmit(data)

        if (!success) {
          return setError("username", { message: "Username is already taken" })
        }
      })}
    >
      <FormField label="First Name" error={errors.firstName?.message}>
        {(props) => (
          <input
            {...register("firstName", { required: "First name is required" })}
            {...props}
            className="input"
            placeholder="John"
          />
        )}
      </FormField>
      <FormField label="Last Name" error={errors.lastName?.message}>
        {(props) => (
          <input
            {...register("lastName", { required: "Last name is required" })}
            {...props}
            className="input"
            placeholder="John"
          />
        )}
      </FormField>
      <FormField label="Username" error={errors.username?.message}>
        {(props) => (
          <input
            {...register("username", { required: "Username is required" })}
            {...props}
            className="input"
            placeholder="John"
          />
        )}
      </FormField>
      <FormField label="Bio" error={errors.bio?.message}>
        {(props) => (
          <textarea
            {...register("bio", {
              maxLength: { value: 160, message: "Bio must be less than 160 characters" },
            })}
            {...props}
            className="input h-24 resize-none rounded md:min-w-sm"
            placeholder="Tell us about yourself..."
          />
        )}
      </FormField>

      <button type="submit" className="button mt-4 w-full">
        Update Profile
      </button>
    </form>
  )
}
