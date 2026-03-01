import type { LinkuAPI } from "@linku/api-contract"
import { AtSign, Mail, MessageSquare, User } from "lucide-react"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { SubmitButton } from "~/shared/components/submit-button"
import { cn } from "~/shared/utils/cn"
import { useUpdateUserForm } from "./use-update-user-form"

type UpdateUserFormProps = {
  defaultValues?: LinkuAPI.UpdateUser["RequestBody"]
  className?: string
}

export function UpdateUserForm({
  defaultValues,
  className,
}: UpdateUserFormProps) {
  const { fields, errors, submit, isLoading } = useUpdateUserForm(defaultValues)

  return (
    <form className={cn("space-y-6", className)} noValidate onSubmit={submit}>
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

      <SubmitButton loading={isLoading}>Save changes</SubmitButton>
    </form>
  )
}
