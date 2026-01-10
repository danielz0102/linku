import type { Result } from "~/lib/Result.ts"

type Providers = "google" // | "facebook" | "github" | etc.

export type AuthProviderPayload = {
  sub: string
  provider: Providers
  email: string
  firstName: string
  lastName: string
  picture: string
}

export interface AuthProvider {
  getUser(code: string): Promise<Result<AuthProviderPayload>>
}
