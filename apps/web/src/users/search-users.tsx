import { useState } from "react"
import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { Alert } from "~/shared/components/alert"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { useDebounce } from "~/shared/hooks/use-debounce"
import { searchUsers } from "./services/search-users"

export default function SearchUsers() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 350)

  const {
    data: users,
    isPending,
    error,
  } = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  const showMenu = debouncedQuery.length > 0

  return (
    <main className="flex size-full flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Search Users</h1>

      <div className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="absolute left-3 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value.trim())}
            placeholder="Search by name or username…"
            aria-label="Search users"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pr-4 pl-9 text-sm placeholder:text-neutral-500 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {showMenu && (
          <ul
            role="listbox"
            aria-label="Search results"
            className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg"
          >
            {isPending && (
              <li className="flex items-center justify-center p-4">
                <LoadingSpinner size="sm" />
              </li>
            )}

            {!isPending && error && (
              <li className="p-3">
                <Alert>Failed to search for users. Please try again.</Alert>
              </li>
            )}

            {!isPending && !error && users && users.length === 0 && (
              <li className="p-4 text-center text-sm text-neutral-400">
                No users found.
              </li>
            )}

            {!isPending &&
              !error &&
              users?.map((user) => (
                <li key={user.id}>
                  <Link
                    to={`/users/${user.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-700"
                  >
                    <img
                      src={user.profilePicUrl || "/default-pp.jpg"}
                      alt={user.username}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-neutral-400">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  )
}
