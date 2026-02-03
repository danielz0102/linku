import axios from "axios"
import { AtSign, Lock, Mail, User } from "lucide-react"
import { useEffect, useRef } from "react"
import { useRegister } from "~/hooks/useRegister"
import type { ValidationErrorData } from "~/types"
import { Alert } from "./alert"
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
  const { mutate, isPending, isError, error } = useRegister()
  const dataRef = useRef<FormDataRef>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    picture: null,
  })

  useEffect(() => {
    if (isError) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isError])

  const mapError = (error: Error): string => {
    if (!axios.isAxiosError(error)) {
      return "An unexpected error occurred. Please try again."
    }

    if (error.response?.status === 409) {
      return "Username or email already exists. Please choose another."
    }

    if (error.response?.status === 400) {
      const data = error.response.data as ValidationErrorData
      const messages = Object.values(data.errors).flat()
      return messages[0]
    }

    return "An unexpected error occurred. Please try again."
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()

        const { username, email, password, firstName, lastName, picture } =
          dataRef.current

        if (e.currentTarget.checkValidity()) {
          mutate({
            username,
            email,
            password,
            firstName,
            lastName,
            picture,
          })
        }
      }}
    >
      {isError && <Alert>{mapError(error)}</Alert>}

      <ImagePicker
        onChange={(file) => {
          dataRef.current.picture = file
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
            dataRef.current.firstName = e.target.value
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
            dataRef.current.lastName = e.target.value
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
            dataRef.current.username = e.target.value
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
            dataRef.current.email = e.target.value
          },
        }}
      />

      <PasswordField onChange={(v) => (dataRef.current.password = v)} />

      <FormField
        label="Confirm Password"
        Icon={Lock}
        validate={(v) => {
          if (v !== dataRef.current.password) {
            return "Passwords don't match"
          }
        }}
        attrs={{
          type: "password",
          placeholder: "••••••••",
          required: true,
          onChange: (e) => {
            dataRef.current.confirmPassword = e.target.value
          },
        }}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950 focus:outline-none"
      >
        {isPending ? "Loading..." : "Create Account"}
      </button>
    </form>
  )
}
