import { useId } from "react"

type FormFieldProps = {
  label: string
  children: (
    props: Pick<
      React.InputHTMLAttributes<HTMLInputElement>,
      "id" | "aria-invalid" | "aria-describedby"
    >
  ) => React.ReactNode
  error?: string
}

export function FormField({ label, children, error }: FormFieldProps) {
  const id = useId()
  const describedBy = useId()

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>

      {children({
        id,
        ["aria-describedby"]: error ? describedBy : undefined,
        ["aria-invalid"]: error ? "true" : "false",
      })}

      {error && (
        <span className="text-sm text-red-500" role="status" id={describedBy}>
          {error}
        </span>
      )}
    </div>
  )
}
