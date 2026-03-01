import { AtSign, Mail, MessageSquare, User } from "lucide-react"
import { useForm } from "react-hook-form"
import type { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { SubmitButton } from "~/shared/components/submit-button"
import { cn } from "~/shared/utils/cn"

type Fields = {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
}

type UpdateUserFormProps = {
  defaultValues?: Fields
  onSubmit(data: Fields): Promise<void>
  className?: string
}

export function UpdateUserForm({
  defaultValues,
  onSubmit,
  className,
}: UpdateUserFormProps) {
  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues,
  })

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      const apiError = error as ApiError

      if (apiError.code !== "VALIDATION_ERROR") {
        return setError("root", {
          message: apiError.genericMessage,
        })
      }

      const fieldKeys = Object.keys(getValues()) as (keyof Fields)[]

      fieldKeys.forEach((k) => {
        const message = apiError.getValidationError(k)

        if (message) {
          setError(k, { message }, { shouldFocus: true })
        }
      })
    }
  })

  return (
    <form className={cn("space-y-6", className)} noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Root
        label="First Name"
        Icon={User}
        error={errors.firstName?.message}
      >
        <FormField.Input {...register("firstName")} placeholder="John" />
      </FormField.Root>

      <FormField.Root
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input {...register("lastName")} placeholder="Doe" />
      </FormField.Root>

      <FormField.Root
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input {...register("username")} placeholder="johndoe" />
      </FormField.Root>

      <FormField.Root
        label="Email Address"
        Icon={Mail}
        error={errors.email?.message}
      >
        <FormField.Input
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "That's not an email!",
            },
          })}
          type="email"
          placeholder="john_doe@example.com"
          autoComplete="true"
        />
      </FormField.Root>

      <FormField.Root
        label="Bio"
        Icon={MessageSquare}
        error={errors.bio?.message}
        iconClassName="top-4 -translate-y-0"
      >
        <FormField.TextArea
          {...register("bio", {
            maxLength: {
              value: 200,
              message: "Bio cannot exceed 200 characters",
            },
          })}
          rows={4}
          placeholder="Tell us about yourself"
          className="resize-none"
          maxLength={200}
        />
      </FormField.Root>

      <SubmitButton loading={isSubmitting}>Save changes</SubmitButton>
    </form>
  )
}
