import type { ComponentType, InputHTMLAttributes, JSX, ReactNode } from "react"
import { useId, useState } from "react"

type FormFieldProps = {
  label: string
  Icon: ComponentType<JSX.IntrinsicElements["svg"]>
  validate?: (value: string) => string | undefined
  attrs: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "placeholder" | "required" | "onChange"
  >
  children?: ReactNode
}

export function FormField({
  label,
  Icon,
  validate,
  attrs,
  children,
}: FormFieldProps) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-500" />
        <input
          id={id}
          data-has-children={children ? "true" : undefined}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-3 pr-4 pl-11 text-neutral-100 placeholder-neutral-500 user-invalid:border-red-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none data-has-children:pr-12"
          onBlur={(e) => {
            const errorMsg = validate?.(e.target.value) || ""
            e.target.setCustomValidity(errorMsg)

            if (e.target.checkValidity()) {
              setError(null)
            }
          }}
          onInvalid={(e) => {
            setError(e.currentTarget.validationMessage)
          }}
          {...attrs}
        />
        {children}
      </div>

      {error && (
        <p className="text-sm text-red-700" role="status">
          {error}
        </p>
      )}
    </div>
  )
}
