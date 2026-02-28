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
    RequestBody: {
      username: string
      email: string
      password: string
      firstName: string
      lastName: string
    }
    ResponseBody: PublicUser | ErrorBody
  }

  interface GetMe {
    RequestBody: never
    ResponseBody: PublicUser | ErrorBody
  }

  interface UpdateUser {
    RequestBody: {
      username?: string
      email?: string
      firstName?: string
      lastName?: string
      bio?: string
    }
    ResponseBody: PublicUser | ErrorBody
  }

  interface Logout {
    RequestBody: never
    ResponseBody: undefined | ErrorBody
  }
}
