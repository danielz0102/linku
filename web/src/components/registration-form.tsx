import { AtSign, Lock, Mail, User } from "lucide-react"
import { useRef } from "react"
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

      <div className="space-y-2">
        <label htmlFor="firstName" className="input-label">
          First Name
        </label>
        <div className="relative">
          <User className="input-icon" />
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            className="input-field pr-4 pl-11"
            required
            onChange={(e) => {
              formDataRef.current.firstName = e.target.value
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="input-label">
          Last Name
        </label>
        <div className="relative">
          <User className="input-icon" />
          <input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            className="input-field pr-4 pl-11"
            required
            onChange={(e) => {
              formDataRef.current.lastName = e.target.value
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="input-label">
          Username
        </label>
        <div className="relative">
          <AtSign className="input-icon" />
          <input
            id="username"
            type="text"
            placeholder="username"
            className="input-field pr-4 pl-11"
            required
            onChange={(e) => {
              formDataRef.current.username = e.target.value
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="input-label">
          Email Address
        </label>
        <div className="relative">
          <Mail className="input-icon" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="input-field pr-4 pl-11"
            required
            onChange={(e) => {
              formDataRef.current.email = e.target.value
            }}
          />
        </div>
      </div>

      <PasswordField onChange={(v) => (formDataRef.current.password = v)} />

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="input-label">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="input-icon" />
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="input-field pr-4 pl-11"
            required
            onChange={(e) => {
              formDataRef.current.confirmPassword = e.target.value
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950 focus:outline-none"
      >
        Create Account
      </button>
    </form>
  )
}
