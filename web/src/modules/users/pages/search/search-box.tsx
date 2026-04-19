import { IconSearch } from "@tabler/icons-react"

type SearchBoxProps = {
  placeholder?: string
}

export function SearchBox({ placeholder = "Search users by name or username" }: SearchBoxProps) {
  return (
    <div className="border-border bg-surface flex w-full items-center gap-2 rounded-full border px-4 py-2 shadow-sm">
      <IconSearch aria-hidden="true" className="text-foreground/60" strokeWidth={1.5} size={18} />
      <input
        type="search"
        name="search-users"
        placeholder={placeholder}
        className="placeholder:text-foreground/50 w-full outline-none"
      />
    </div>
  )
}
