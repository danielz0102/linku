import { Eye, EyeOff } from "lucide-react"
import { createContext, use, useId, useState } from "react"
import { cn } from "../utils/cn"

const FormFieldContext = createContext<{
  id: string
  invalid: boolean
} | null>(null)

type FormFieldProps = React.PropsWithChildren & {
  label: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  error?: string
}

export function Root({ label, Icon, error, children }: FormFieldProps) {
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
}

type InputProps = Omit<React.ComponentProps<"input">, "id" | "aria-invalid">

export function Input({ className, ...attrs }: InputProps) {
  const context = use(FormFieldContext)

  if (!context) {
    throw new Error(
      "FormField.Input must be used within a FormField.Root component"
    )
  }

  const { id, invalid } = context

  return (
    <input
      id={id}
      aria-invalid={invalid}
      className={cn(
        "w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-3 pr-4 pl-11 text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none aria-invalid:border-red-700 aria-invalid:ring-0",
        className
      )}
      {...attrs}
    />
  )
}

export function PasswordInput(props: Omit<InputProps, "type" | "className">) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  return (
    <>
      <Input
        className="pr-12"
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
}

type TextAreaProps = Omit<
  React.ComponentProps<"textarea">,
  "id" | "aria-invalid"
>

export function TextArea({ className, ...attrs }: TextAreaProps) {
  const context = use(FormFieldContext)

  if (!context) {
    throw new Error(
      "FormField.TextArea must be used within a FormField.Root component"
    )
  }

  const { id, invalid } = context

  return (
    <textarea
      id={id}
      aria-invalid={invalid}
      className={cn(
        "w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-3 pr-4 pl-11 text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none aria-invalid:border-red-700 aria-invalid:ring-0",
        className
      )}
      {...attrs}
    />
  )
}

export default {
  Root,
  Input,
  PasswordInput,
  TextArea,
}
