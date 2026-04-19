import { useState } from "react"

import { api } from "~/shared/api/api"
import { useDebounce } from "~/shared/hooks/use-debounce"

import type { User } from "../../domain/user"
import { SearchBox } from "./search-box"
import { UserList } from "./user-list"

export default function SearchPage() {
  const [users, setUsers] = useState<User[]>([])
  const debounce = useDebounce(300)

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="title">Search Users</h1>
        <p className="text-muted">Find people by their name or username.</p>
      </header>

      <section className="space-y-4">
        <SearchBox
          placeholder="Search users by name or username"
          onChange={(q) =>
            debounce(async () => {
              if (q.trim() === "") {
                setUsers([])
                return
              }

              const results = await api.users.search({ query: q })
              setUsers(results)
            })
          }
        />

        <div role="status" className="sr-only">
          {users.length} users
        </div>

        <UserList users={users} />
      </section>
    </main>
  )
}
