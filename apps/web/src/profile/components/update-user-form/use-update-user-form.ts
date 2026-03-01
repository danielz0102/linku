import type { LinkuAPI } from "@linku/api-contract"
import { useForm } from "react-hook-form"
import { useAuth } from "~/auth/context/auth-context"
import type { ApiError } from "~/shared/api/api-error"
import { updateUser } from "../../services/update-user"

type Inputs = LinkuAPI.UpdateUser["RequestBody"]

export function useUpdateUserForm(defaultValues?: Inputs) {
  const { refresh } = useAuth()

  const {
    register,
    setError,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues,
  })

  const fields = {
    username: register("username"),
    email: register("email", {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "That's not an email!",
      },
    }),
    firstName: register("firstName"),
    lastName: register("lastName"),
    bio: register("bio"),
  }

  const submit = handleSubmit(async (data) => {
    try {
      await updateUser(data)
      await refresh()
    } catch (error) {
      const apiError = error as ApiError

      if (apiError.code !== "VALIDATION_ERROR") {
        return setError("root", {
          message: apiError.genericMessage,
        })
      }

      const fieldKeys = Object.keys(getValues()) as (keyof Inputs)[]

      fieldKeys.forEach((k) => {
        const message = apiError.getValidationError(k)

        if (message) {
          setError(k, { message }, { shouldFocus: true })
        }
      })
    }
  })

  return {
    submit,
    isLoading: isSubmitting,
    fields,
    errors,
  }
}
