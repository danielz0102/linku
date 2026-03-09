import { AtSign, Mail, MessageSquare, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { ApiError } from "~/shared/api/api-error"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { PrimaryButton } from "~/shared/components/primary-button"
import { cn } from "~/shared/utils/cn"

type UpdateUserData = {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
}

type UpdateUserFormProps = {
  defaultValues?: UpdateUserData
  onSubmit(data: UpdateUserData): Promise<void>
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
  } = useForm<UpdateUserData>({
    defaultValues,
  })

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return setError("root", {
          message: new ApiError("UNEXPECTED_ERROR").genericMessage,
        })
      }

      if (error.code !== "VALIDATION_ERROR") {
        return setError("root", {
          message: error.genericMessage,
        })
      }

      const fieldKeys = Object.keys(getValues()) as (keyof UpdateUserData)[]

      fieldKeys.forEach((k) => {
        const message = error.getValidationError(k)

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
        <FormField.Input
          {...register("firstName", { required: "First name is required" })}
          placeholder="John"
        />
      </FormField.Root>

      <FormField.Root
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Doe"
        />
      </FormField.Root>

      <FormField.Root
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input
          {...register("username", { required: "Username is required" })}
          placeholder="johndoe"
        />
      </FormField.Root>

      <FormField.Root
        label="Email Address"
        Icon={Mail}
        error={errors.email?.message}
      >
        <FormField.Input
          {...register("email", {
            required: "Email is required",
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

      <PrimaryButton type="submit" loading={isSubmitting}>
        Save changes
      </PrimaryButton>
    </form>
  )
}
