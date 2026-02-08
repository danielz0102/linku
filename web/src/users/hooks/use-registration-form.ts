import { useForm } from "react-hook-form"
import { useRegisterMutation } from "./use-register-mutation"

export function useRegistrationForm() {
  const form = useForm<Inputs>()

  const { setError, getValues, handleSubmit } = form

  const { mutate, isPending } = useRegisterMutation({
    handleExternalError: (error) => {
      setError("root", { message: error })
    },
    handleApiError: (data) => {
      const { errors } = data

      if (!errors.some(({ field }) => isInput(field))) {
        return setError("root", {
          message: "An unexpected error occurred. Please try again later.",
        })
      }

      errors.forEach(({ field, details }) => {
        if (isInput(field)) {
          setError(field, { message: details }, { shouldFocus: true })
        }
      })

      function isInput(field: string): field is keyof Inputs {
        const inputs = Object.keys(getValues())
        return inputs.includes(field)
      }
    },
  })

  const submit = handleSubmit((data) => {
    const { username, email, password, firstName, lastName } = data
    mutate({
      username,
      email,
      password,
      firstName,
      lastName,
    })
  })

  return { form, submit, isLoading: isPending }
}

type Inputs = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}
