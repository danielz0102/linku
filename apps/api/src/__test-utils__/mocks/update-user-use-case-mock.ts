import type { UserRepository } from "~/core/users/user-repository.ts"

import { UpdateUserUseCase } from "~/core/use-cases/update-user-use-case.ts"

export class UpdateUserUseCaseMock extends UpdateUserUseCase {
  constructor() {
    super({ userRepo: {} as UserRepository })
  }

  override execute = vi.fn<UpdateUserUseCase["execute"]>()
}
