import { PasswordHasher } from "#modules/users/interfaces/password-hasher.js"

export class PasswordHasherMock extends PasswordHasher {
  constructor() {
    super(1)
  }

  hash = vi.fn<PasswordHasher["hash"]>()
  compare = vi.fn<PasswordHasher["compare"]>()
}
