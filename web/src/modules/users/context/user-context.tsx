import { createContext, use, useState } from "react"

import type { UserEntity } from "../domain/user-entity"
import { whoami } from "./whoami"

type UserContextValue =
  | {
      user: UserEntity | undefined
      setUser: React.Dispatch<React.SetStateAction<UserEntity | undefined>>
    }
  | undefined

const UserContext = createContext<UserContextValue>(undefined)

const me = await whoami()

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserEntity | undefined>(me)

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
  const { user, setUser } = useUser()

  if (!user) {
    throw new Error("User is not authenticated")
  }

  return { user, setUser }
}
