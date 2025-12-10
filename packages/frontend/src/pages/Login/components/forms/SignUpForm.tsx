import { useRef } from "react"
import Button from "~/components/ui/Button"
import ConfirmPassword from "../fields/ConfirmPassword"
import EmailField from "../fields/EmailField"
import SecurePassword from "../fields/SecurePassword"
import UsernameField from "../fields/UsernameField"

interface SignUpFormData {
  email: string
  username: string
  password: string
}

interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => void
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const data = useRef<SignUpFormData>({ email: "", username: "", password: "" })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(data.current)
      }}
      className="flex flex-col gap-4"
    >
      <EmailField
        onChange={(value) => {
          data.current.email = value
        }}
      />
      <UsernameField
        onChange={(value) => {
          data.current.username = value
        }}
      />
      <SecurePassword
        onChange={(value) => {
          data.current.password = value
        }}
      />
      <ConfirmPassword onConfirm={(value) => value === data.current.password} />
      <Button type="submit" className="mt-2 w-full">
        Sign Up
      </Button>
    </form>
  )
}
