import { AtSign, Lock } from "lucide-react"
import { Alert } from "~/components/alert"
import { FormField } from "~/components/form-field"
import { useLoginForm } from "../hooks/use-login-form"

export function LoginForm() {
  const { fields, errors, submit, isLoading } = useLoginForm()

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      {errors.root && <Alert>{errors.root.message}</Alert>}

      <FormField.Provider
        label="Username"
        Icon={AtSign}
        error={errors.username?.message}
      >
        <FormField.Input {...fields.username} placeholder="johndoe" />
      </FormField.Provider>

      <FormField.Provider
        label="Password"
        Icon={Lock}
        error={errors.password?.message}
      >
        <FormField.PasswordInput placeholder="••••••••" {...fields.password} />
      </FormField.Provider>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950 focus:outline-none"
      >
        {isLoading ? "Loading..." : "Log In"}
      </button>
    </form>
  )
}
