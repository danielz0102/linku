import { useForm } from "react-hook-form"

export function useRegistrationForm() {
  const form = useForm<Inputs>()
  return { ...form }
}

export type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}
