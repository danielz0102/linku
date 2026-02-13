import { AtSign, Lock, Mail, User } from "lucide-react"
import { Alert } from "~/shared/components/alert"
import { FormField } from "~/shared/components/form-field"
import { useRegistrationForm } from "../hooks/use-registration-form"
import { SubmitButton } from "./submit-button"

export function RegistrationForm() {
  const { fields, errors, submit, isLoading } = useRegistrationForm()

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Provider
        label="First Name"
        Icon={User}
        error={errors.firstName?.message}
      >
        <FormField.Input {...fields.firstName} placeholder="John" />
      </FormField.Provider>

      <FormField.Provider
        label="Last Name"
        Icon={User}
        error={errors.lastName?.message}
      >
        <FormField.Input {...fields.lastName} placeholder="Doe" />
      </FormField.Provider>

      <FormField.Provider
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input {...fields.username} placeholder="johndoe" />
      </FormField.Provider>

      <FormField.Provider
        label="Email Address"
        Icon={Mail}
        error={errors.email?.message}
      >
        <FormField.Input
          {...fields.email}
          type="email"
          placeholder="john_doe@example.com"
        />
      </FormField.Provider>

      <FormField.Provider
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput placeholder="••••••••" {...fields.password} />
      </FormField.Provider>

      <FormField.Provider
        label="Confirm Password"
        Icon={Lock}
        error={errors.confirmPassword?.message}
      >
        <FormField.Input
          type="password"
          placeholder="••••••••"
          {...fields.confirmPassword}
        />
      </FormField.Provider>

      <SubmitButton loading={isLoading}>Create Account</SubmitButton>
    </form>
  )
}
