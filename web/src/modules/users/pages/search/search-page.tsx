import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { api } from "~/shared/api/api"
import { useDebounce } from "~/shared/hooks/use-debounce"

import { SearchBox } from "./search-box"
import { UserList } from "./user-list"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const debounce = useDebounce(300)

  const { data } = useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => {
      if (query.trim() === "") {
        return []
      }

      return api.users.search(query)
    },
    initialData: [],
  })

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="title">Search Users</h1>
        <p className="text-muted">Find people by their name or username.</p>
      </header>

      <section className="space-y-4">
        <SearchBox
          placeholder="Search users by name or username"
          onChange={(q) => debounce(() => setQuery(q))}
        />

        <div role="status" className="sr-only">
          {data.length} users
        </div>

        <UserList users={data} />
      </section>
    </main>
  )
}
