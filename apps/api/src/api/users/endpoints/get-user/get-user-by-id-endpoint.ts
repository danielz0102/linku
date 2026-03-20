import { GetUserByIdUseCase } from "#core/use-cases/get-user-by-id-use-case.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { onlyAuth } from "#shared/auth/only-auth.js"

import { getUserByIdHandler } from "./get-user-by-id-handler.js"

export class GetUserByIdEndpoint {
  constructor(private readonly getUser: GetUserByIdUseCase) {}

  static buildDefault() {
    return new GetUserByIdEndpoint(new GetUserByIdUseCase(new DrizzleUserRepository())).build()
  }

  build() {
    return [onlyAuth, getUserByIdHandler(this.getUser)]
  }
}
