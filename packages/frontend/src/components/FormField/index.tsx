import type { InputHTMLAttributes, PropsWithChildren } from "react"
import { useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Eye, EyeOff } from "lucide-react"

export default function FormField({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-2">{children}</div>
}

FormField.LabelRow = FormFieldLabelRow
FormField.Label = FormFieldLabel
FormField.Input = FormFieldInput
FormField.Link = FormFieldLink

function FormFieldLabelRow({ children }: PropsWithChildren) {
  return <div className="flex items-center justify-between">{children}</div>
}

function FormFieldLabel({ children }: PropsWithChildren) {
  return <label className="text-sm font-medium text-white">{children}</label>
}

type OmittedInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "onInvalid" | "onBlur"
>

interface FormFieldInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof OmittedInputProps> {
  type?: "text" | "email" | "password"
  hideVisibilityToggle?: boolean
  setCustomError?: (validity: ValidityState) => string
}

function FormFieldInput({
  type = "text",
  hideVisibilityToggle,
  setCustomError,
  ...props
}: FormFieldInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const isPasswordField = type === "password"
  const shouldShowToggle = isPasswordField && !hideVisibilityToggle
  const inputType = isPasswordField && isPasswordVisible ? "text" : type

  const toggleVisibility = () => {
    const newState = !isPasswordVisible
    setIsPasswordVisible(newState)
  }

  const updateValidationState = () => {
    const input = inputRef.current

    if (!input) {
      throw new Error("Input ref is not assigned")
    }

    const errorMessage = setCustomError
      ? setCustomError(input.validity)
      : input.validationMessage
    setErrorMessage(errorMessage)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          ref={inputRef}
          type={inputType}
          className={twMerge(
            "w-full rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none",
            shouldShowToggle && "pr-12",
            errorMessage && "ring-2 ring-red-500"
          )}
          onInvalid={(e) => {
            e.preventDefault()
            updateValidationState()
          }}
          onBlur={updateValidationState}
          {...props}
        />
        {shouldShowToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-live="polite"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        )}
      </div>
      <span className="text-sm text-red-500" role="alert">
        {errorMessage}
      </span>
    </div>
  )
}

interface FormFieldLinkProps extends PropsWithChildren {
  href: string
  rel?: string
}

function FormFieldLink({ href, rel, children }: FormFieldLinkProps) {
  return (
    <a
      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline focus:underline focus:outline-none"
      href={href}
      rel={rel}
    >
      {children}
    </a>
  )
}
