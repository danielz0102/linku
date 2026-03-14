import type { UserRepository } from "~/users/domain/user-repository.js"

import { UpdateUserUseCase } from "~/features/update-user/update-user-use-case.ts"

export class UpdateUserUseCaseMock extends UpdateUserUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
    })
  }

  override execute = vi.fn<UpdateUserUseCase["execute"]>()
}
