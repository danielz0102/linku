import { UpdateUserUseCase } from "~/users/application/use-cases/update-user-use-case.ts"
import type { UserRepository } from "~/users/application/ports/user-repository.js"

export class UpdateUserUseCaseMock extends UpdateUserUseCase {
  constructor() {
    super({
      userRepo: {} as UserRepository,
    })
  }

  override update = vi.fn<UpdateUserUseCase["update"]>()
}
