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

type UserPrimitives = {
  id: string
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  bio: string | null
}

export class User {
  readonly #id: UUID
  #username: string
  #email: Email
  readonly #hashedPassword: string
  #firstName: string
  #lastName: string
  #profilePicUrl: URL | null
  #bio: string | null

  constructor(params: UserParams) {
    this.#id = new UUID(params.id)
    this.#username = params.username
    this.#email = new Email(params.email)
    this.#hashedPassword = params.hashedPassword
    this.#firstName = params.firstName
    this.#lastName = params.lastName
    this.#profilePicUrl = params.profilePicUrl ? new URL(params.profilePicUrl) : null
    this.#bio = params.bio ?? null
  }

  get id(): string {
    return this.#id.value
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

  toPrimitives(): UserPrimitives {
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

  update(
    fields: Partial<{
      username: string
      email: string
      firstName: string
      lastName: string
      profilePicUrl: string
      bio: string
    }>
  ) {
    const { username, email, firstName, lastName, profilePicUrl, bio } = fields

    if (username) {
      this.#username = username
    }
    if (email) {
      this.#email = new Email(email)
    }
    if (firstName) {
      this.#firstName = firstName
    }
    if (lastName) {
      this.#lastName = lastName
    }
    if (profilePicUrl) {
      this.#profilePicUrl = new URL(profilePicUrl)
    }
    if (bio) {
      this.#bio = bio
    }
  }
}
