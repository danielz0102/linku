import { AtSign, Lock, Mail, User } from "lucide-react"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { useRegistrationForm } from "../hooks/use-registration-form"
import { SubmitButton } from "./submit-button"

export function RegistrationForm() {
  const { fields, errors, submit, isLoading } = useRegistrationForm()

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
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput placeholder="••••••••" {...fields.password} />
      </FormField.Root>

      <FormField.Root
        label="Confirm Password"
        Icon={Lock}
        error={errors.confirmPassword?.message}
      >
        <FormField.Input
          type="password"
          placeholder="••••••••"
          {...fields.confirmPassword}
        />
      </FormField.Root>

      <SubmitButton loading={isLoading}>Create Account</SubmitButton>
    </form>
  )
}
