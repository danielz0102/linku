import { AtSign, Mail, MessageSquare, User } from "lucide-react"
import type { LinkuAPI } from "@linku/api-contract"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { useUpdateUserForm } from "./use-update-user-form"

type UpdateUserFormProps = {
  defaultValues?: LinkuAPI.UpdateUser["RequestBody"]
}

export function UpdateUserForm({ defaultValues }: UpdateUserFormProps) {
  const { fields, errors, submit, isLoading } = useUpdateUserForm(defaultValues)

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Root
        label="First Name"
        Icon={User}
        error={errors.firstName?.message}
      >
        <FormField.Input {...fields.firstName} placeholder="John" />
      </FormField.Root>

      <FormField.Root
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input {...fields.lastName} placeholder="Doe" />
      </FormField.Root>

      <FormField.Root
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input {...fields.username} placeholder="johndoe" />
      </FormField.Root>

      <FormField.Root
        label="Email Address"
        Icon={Mail}
        error={errors.email?.message}
      >
        <FormField.Input
          {...fields.email}
          type="email"
          placeholder="john_doe@example.com"
          autoComplete="true"
        />
      </FormField.Root>

      <FormField.Root
        label="Bio"
        Icon={MessageSquare}
        error={errors.bio?.message}
      >
        <FormField.TextArea
          {...fields.bio}
          rows={4}
          placeholder="Tell us about yourself"
        />
      </FormField.Root>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 focus-visible:outline-none active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  )
}
