import { AtSign, Lock } from "lucide-react"
import { Alert } from "~/shared/components/alert"
import FormField from "~/shared/components/form-field"
import { useLoginForm } from "../hooks/use-login-form"
import { SubmitButton } from "./submit-button"

export function LoginForm() {
  const { fields, errors, submit, isLoading } = useLoginForm()

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Root
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input {...fields.username} placeholder="johndoe" />
      </FormField.Root>

      <FormField.Root
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput placeholder="••••••••" {...fields.password} />
      </FormField.Root>

      <SubmitButton loading={isLoading}>Log In</SubmitButton>
    </form>
  )
}
