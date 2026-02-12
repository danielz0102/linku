import { useForm } from "react-hook-form"

export function useLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const submit = handleSubmit(() => {})

  const fields = {
    username: register("username", { required: "Username is required" }),
    password: register("password", { required: "Password is required" }),
  }

  return { submit, isLoading: isSubmitting, fields, errors }
}

type Inputs = {
  username: string
  password: string
}
