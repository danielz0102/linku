import { useForm } from "react-hook-form"

import { FormField } from "~/shared/components/form-field"

type UpdateUserFormProps = {
  initialData: UpdateUserFormInputs
}

type UpdateUserFormInputs = {
  firstName: string
  lastName: string
  username: string
  bio: string | null
}

export function UpdateUserForm({ initialData }: UpdateUserFormProps) {
  const { register } = useForm<UpdateUserFormInputs>({
    defaultValues: initialData,
  })

  return (
    <form className="space-y-2">
      <FormField label="First Name">
        {(props) => (
          <input {...register("firstName")} {...props} className="input" placeholder="John" />
        )}
      </FormField>
      <FormField label="Last Name">
        {(props) => (
          <input {...register("lastName")} {...props} className="input" placeholder="John" />
        )}
      </FormField>
      <FormField label="Username">
        {(props) => (
          <input {...register("username")} {...props} className="input" placeholder="John" />
        )}
      </FormField>
      <FormField label="Bio">
        {(props) => (
          <textarea
            {...register("bio")}
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
