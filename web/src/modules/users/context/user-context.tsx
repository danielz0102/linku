import {
  createContext,
  use,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"

import type { User } from "../domain/user"

type UserContextValue =
  | {
      user: User | undefined
      setUser: Dispatch<SetStateAction<User | undefined>>
    }
  | undefined

const UserContext = createContext<UserContextValue>(undefined)

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>()

  return <UserContext value={{ user, setUser }}>{children}</UserContext>
}

export function useUser() {
  const value = use(UserContext)

  if (!value) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return value
}
