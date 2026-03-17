import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

import { useDebounce } from "~/sections/users/hooks/use-debounce"
import { Alert } from "~/ui/components/alert"
import { LoadingSpinner } from "~/ui/components/loading-spinner"

import { searchUsers } from "./services/search-users"

export default function SearchUsers() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 350)
  const searchTerm = debouncedQuery.trim()
  const showMenu = searchTerm.length > 0

  const {
    data: users,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["users", "search", searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: showMenu,
  })

  return (
    <main className="flex size-full flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Search Users</h1>

      <div className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 text-neutral-400" />

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pr-4 pl-9 text-sm placeholder:text-neutral-500 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {isPending && (
          <p className="sr-only" role="status">
            Searching for users…
          </p>
        )}

        {error && <Alert>Failed to search for users. Please try again.</Alert>}

        {isSuccess && (
          <p className="sr-only" role="status">
            {users.length > 0
              ? `Found ${users.length} user${users.length > 1 ? "s" : ""}.`
              : "No users found."}
          </p>
        )}

        {showMenu && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
            {isPending && (
              <li className="flex justify-center p-4">
                <LoadingSpinner size="sm" />
              </li>
            )}

            {isSuccess &&
              users.map((user) => (
                <li key={user.id}>
                  <Link
                    to={`/users/${user.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-700 focus-visible:bg-slate-700 focus-visible:outline-none"
                  >
                    <img
                      src={user.profilePicUrl || "/default-pp.jpg"}
                      alt=""
                      className="size-9 shrink-0 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-neutral-400">@{user.username}</p>
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
