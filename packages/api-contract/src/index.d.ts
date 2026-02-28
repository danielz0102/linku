import type { ErrorBody, ErrorCode } from "./error.d.ts"
import type { RegistrationBody } from "./registration.d.ts"
import type { UpdateUserBody } from "./update-user.d.ts"
import type { PublicUser } from "./user.d.ts"

export namespace LinkuAPI {
  type ErrorCode = import("./error.d.ts").ErrorCode
  type ErrorBody = import("./error.d.ts").ErrorBody
  type PublicUser = import("./user.d.ts").PublicUser

  interface Login {
    RequestBody: {
      username: string
      password: string
    }
    ResponseBody: PublicUser | ErrorBody
  }

  interface RegisterUser {
    RequestBody: RegistrationBody
    ResponseBody: PublicUser | ErrorBody
  }

  interface GetMe {
    RequestBody: never
    ResponseBody: PublicUser | ErrorBody
  }

  interface UpdateUser {
    RequestBody: UpdateUserBody
    ResponseBody: PublicUser | ErrorBody
  }

  interface Logout {
    RequestBody: never
    ResponseBody: undefined | ErrorBody
  }
}
