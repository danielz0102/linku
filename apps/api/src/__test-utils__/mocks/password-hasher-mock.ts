import { PasswordHasher } from "~/users/interfaces/password-hasher.ts"

export class PasswordHasherMock extends PasswordHasher {
  constructor() {
    super(1)
  }

  hash = vi.fn<PasswordHasher["hash"]>()
  compare = vi.fn<PasswordHasher["compare"]>()
}
