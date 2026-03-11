import { UUID } from "#shared/domain/uuid.js"

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
  readonly #email: string
  readonly #hashedPassword: string
  readonly #firstName: string
  readonly #lastName: string
  readonly #profilePicUrl: string | null
  readonly #bio: string | null

  constructor(params: UserParams) {
    this.#id = new UUID(params.id)
    this.#username = params.username
    this.#email = params.email
    this.#hashedPassword = params.hashedPassword
    this.#firstName = params.firstName
    this.#lastName = params.lastName
    this.#profilePicUrl = params.profilePicUrl ?? null
    this.#bio = params.bio ?? null
  }

  get username() {
    return this.#username
  }

  get email() {
    return this.#email
  }

  get password() {
    return this.#hashedPassword
  }

  toPrimitives() {
    return {
      id: this.#id.value,
      username: this.#username,
      email: this.#email,
      hashedPassword: this.#hashedPassword,
      firstName: this.#firstName,
      lastName: this.#lastName,
      profilePicUrl: this.#profilePicUrl,
      bio: this.#bio,
    }
  }
}
