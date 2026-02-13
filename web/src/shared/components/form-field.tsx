import { Eye, EyeOff } from "lucide-react"
import type {
  ComponentProps,
  ComponentType,
  JSX,
  PropsWithChildren,
} from "react"
import { createContext, use, useId, useState } from "react"

type FormFieldProps = PropsWithChildren & {
  label: string
  Icon: ComponentType<JSX.IntrinsicElements["svg"]>
  error?: string
}

type InputProps = Omit<
  ComponentProps<"input">,
  "id" | "className" | "aria-invalid"
>

type PasswordInputProps = Omit<InputProps, "type">

export const FormField = {
  Provider({ label, Icon, error, children }: FormFieldProps) {
    const id = useId()

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm">
          {label}
        </label>

        <div className="relative">
          <Icon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-500" />

          <FormFieldContext value={{ id, invalid: Boolean(error) }}>
            {children}
          </FormFieldContext>
        </div>

        {error && (
          <p role="status" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  },
  Input(props: InputProps) {
    const { id, invalid } = useContext()

    return (
      <input
        id={id}
        aria-invalid={invalid}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-3 pr-4 pl-11 text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none aria-invalid:border-red-700 aria-invalid:ring-0 data-has-sibling:pr-12"
        {...props}
      />
    )
  },
  PasswordInput(props: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false)
    const Icon = isVisible ? EyeOff : Eye

    return (
      <>
        <FormField.Input
          data-has-sibling
          type={isVisible ? "text" : "password"}
          {...props}
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-400"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <Icon
            className="size-5"
            aria-label={isVisible ? "Hide password" : "Show password"}
          />
        </button>
      </>
    )
  },
}

type ContextValue = {
  id: string
  invalid: boolean
}

const FormFieldContext = createContext<ContextValue | null>(null)

function useContext() {
  const context = use(FormFieldContext)

  if (!context) {
    throw new Error(
      "FormField components must be used within FormField.Provider"
    )
  }

  return context
}
