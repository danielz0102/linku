import { IconSearch } from "@tabler/icons-react"
import { useId } from "react"

type SearchBoxProps = {
  placeholder: string
  onChange: (value: string) => void
}

export function SearchBox({ placeholder, onChange }: SearchBoxProps) {
  const id = useId()

  return (
    <div className="border-border bg-surface flex w-full items-center gap-2 rounded-full border px-4 py-2 shadow-sm focus-within:outline">
      <IconSearch aria-hidden="true" className="text-foreground/60" strokeWidth={1.5} size={18} />

      <label htmlFor={id} className="sr-only">
        Search users
      </label>

      <input
        id={id}
        type="search"
        name="search-users"
        placeholder={placeholder}
        className="placeholder:text-foreground/50 w-full outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
