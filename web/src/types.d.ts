import type { JwtPayload } from "jwt-decode"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  picture: string
}

export type UserPayload = User & JwtPayload
