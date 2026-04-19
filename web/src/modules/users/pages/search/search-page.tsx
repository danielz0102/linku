import { useId } from "react"

import type { User } from "~/modules/users/domain/user"

import { SearchBox } from "./search-box"
import { UserList } from "./user-list"

export default function SearchPage() {
  const listId = useId()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="title">Search Users</h1>
        <p className="text-muted">Find people by their name or username.</p>
      </header>

      <section className="space-y-4">
        <SearchBox placeholder="Search users by name or username" onChange={() => {}} />
        <UserList id={listId} users={DUMMY_USERS} />
      </section>
    </main>
  )
}

const DUMMY_USERS: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePictureUrl: "https://cataas.com/cat",
    bio: "Coffee-first developer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePictureUrl: null,
    bio: "Frontend enthusiast",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Mendez",
    username: "carlitos",
    profilePictureUrl: "https://cataas.com/cat/says/hi",
    bio: "Always shipping",
  },
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePictureUrl: "https://cataas.com/cat",
    bio: "Coffee-first developer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePictureUrl: null,
    bio: "Frontend enthusiast",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Mendez",
    username: "carlitos",
    profilePictureUrl: "https://cataas.com/cat/says/hi",
    bio: "Always shipping",
  },
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePictureUrl: "https://cataas.com/cat",
    bio: "Coffee-first developer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePictureUrl: null,
    bio: "Frontend enthusiast",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Mendez",
    username: "carlitos",
    profilePictureUrl: "https://cataas.com/cat/says/hi",
    bio: "Always shipping",
  },
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePictureUrl: "https://cataas.com/cat",
    bio: "Coffee-first developer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePictureUrl: null,
    bio: "Frontend enthusiast",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Mendez",
    username: "carlitos",
    profilePictureUrl: "https://cataas.com/cat/says/hi",
    bio: "Always shipping",
  },
]
