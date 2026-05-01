import { createContext, use, useState } from "react"

import type { User } from "../domain/user"
import { whoami } from "./whoami"

type UserContextValue =
  | {
      user: User | undefined
      setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    }
  | undefined

const UserContext = createContext<UserContextValue>(undefined)

const me = await whoami()

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(me)

  return <UserContext value={{ user, setUser }}>{children}</UserContext>
}

export function useUser() {
  const value = use(UserContext)

  if (!value) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return value
}

export function useAuthenticatedUser() {
  const value = useUser()

  if (!value.user) {
    throw new Error("User is not authenticated")
  }

  return value
}
