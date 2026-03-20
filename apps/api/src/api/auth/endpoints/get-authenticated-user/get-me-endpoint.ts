import { GetAuthenticatedUser } from "#core/use-cases/get-authenticated-user-use-case.js"
import { DrizzleUserRepository } from "#shared/adapters/drizzle-user-repository.js"
import { onlyAuth } from "#shared/middlewares/only-auth.js"

import { getMeHandler } from "./get-me-handler.js"

export class GetMeEndpoint {
  constructor(private readonly getUser: GetAuthenticatedUser) {}

  static buildDefault() {
    return new GetMeEndpoint(new GetAuthenticatedUser(new DrizzleUserRepository())).build()
  }

  build() {
    return [onlyAuth, getMeHandler(this.getUser)]
  }
}
