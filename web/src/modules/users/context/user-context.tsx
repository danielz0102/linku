import { createContext, use, useEffect, useState } from "react"

import { Spinner } from "~/shared/components/spinner"

import type { User } from "../domain/user"
import { whoami } from "./whoami"

type UserContextValue =
  | {
      user: User | undefined
      setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    }
  | undefined

const UserContext = createContext<UserContextValue>(undefined)

const meRequest = whoami().catch(() => undefined)

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    void meRequest.then((me) => {
      if (!isMounted) return

      setUser(me)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <Spinner />
  }

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
