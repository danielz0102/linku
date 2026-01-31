import { AtSign, Lock, Mail, User } from "lucide-react"
import { useRef } from "react"
import { FormField } from "./form-field"
import { ImagePicker } from "./image-picker"
import { PasswordField } from "./password-field"

type FormDataRef = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  picture: File | null
}

export function RegistrationForm() {
  const formDataRef = useRef<FormDataRef>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: null,
  })

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.target.checkValidity()
      }}
    >
      <ImagePicker
        onImageSelect={(file) => {
          formDataRef.current.picture = file
        }}
      />

      <FormField
        label="First Name"
        Icon={User}
        attrs={{
          type: "text",
          placeholder: "Enter your first name",
          required: true,
          onChange: (e) => {
            formDataRef.current.firstName = e.target.value
          },
        }}
      />

      <FormField
        label="Last Name"
        Icon={User}
        attrs={{
          type: "text",
          placeholder: "Enter your last name",
          required: true,
          onChange: (e) => {
            formDataRef.current.lastName = e.target.value
          },
        }}
      />

      <FormField
        label="Username"
        Icon={AtSign}
        attrs={{
          type: "text",
          placeholder: "username",
          required: true,
          onChange: (e) => {
            formDataRef.current.username = e.target.value
          },
        }}
      />

      <FormField
        label="Email Address"
        Icon={Mail}
        attrs={{
          type: "email",
          placeholder: "you@example.com",
          required: true,
          onChange: (e) => {
            formDataRef.current.email = e.target.value
          },
        }}
      />

      <PasswordField onChange={(v) => (formDataRef.current.password = v)} />

      <FormField
        label="Confirm Password"
        Icon={Lock}
        attrs={{
          type: "password",
          placeholder: "••••••••",
          required: true,
          onChange: (e) => {
            formDataRef.current.confirmPassword = e.target.value
          },
        }}
      />

      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950 focus:outline-none"
      >
        Create Account
      </button>
    </form>
  )
}
