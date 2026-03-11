import { UUID } from "#shared/domain/uuid.js"
import { Email } from "./email.js"

type UserParams = {
  id?: string
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl?: string | null
  bio?: string | null
}

export class User {
  readonly #id: UUID
  readonly #username: string
  readonly #email: Email
  readonly #hashedPassword: string
  readonly #firstName: string
  readonly #lastName: string
  readonly #profilePicUrl: URL | null
  readonly #bio: string | null

  constructor(params: UserParams) {
    this.#id = new UUID(params.id)
    this.#username = params.username
    this.#email = new Email(params.email)
    this.#hashedPassword = params.hashedPassword
    this.#firstName = params.firstName
    this.#lastName = params.lastName
    this.#profilePicUrl = params.profilePicUrl
      ? new URL(params.profilePicUrl)
      : null
    this.#bio = params.bio ?? null
  }

  get username(): string {
    return this.#username
  }

  get email(): string {
    return this.#email.value
  }

  get password(): string {
    return this.#hashedPassword
  }

  toPrimitives(): {
    id: string
    username: string
    email: string
    hashedPassword: string
    firstName: string
    lastName: string
    profilePicUrl: string | null
    bio: string | null
  } {
    return {
      id: this.#id.value,
      username: this.#username,
      email: this.#email.value,
      hashedPassword: this.#hashedPassword,
      firstName: this.#firstName,
      lastName: this.#lastName,
      profilePicUrl: this.#profilePicUrl?.href ?? null,
      bio: this.#bio,
    }
  }
}
