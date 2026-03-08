export namespace LinkuAPI {
  type ErrorCode = import("./error.d.ts").ErrorCode
  type ErrorBody = import("./error.d.ts").ErrorBody
  type User = import("./user.d.ts").User

  interface Login {
    RequestBody: {
      username: string
      password: string
    }
    ResponseBody: User | ErrorBody
  }

  interface RegisterUser {
    RequestBody: {
      username: string
      email: string
      password: string
      firstName: string
      lastName: string
    }
    ResponseBody: User | ErrorBody
  }

  interface GetMe {
    RequestBody: never
    ResponseBody: User | ErrorBody
  }

  interface UpdateUser {
    RequestBody: {
      username?: string
      email?: string
      firstName?: string
      lastName?: string
      bio?: string
      profilePicUrl?: string
    }
    ResponseBody: User | ErrorBody
  }

  interface UploadSignature {
    RequestBody: never
    ResponseBody: {
      signature: string
      timestamp: number
      cloudName: string
      api_key: string
      folder: string
      public_id: string
    }
  }

  interface GetUserById {
    Params: { id: string }
    RequestBody: never
    ResponseBody: User | ErrorBody
  }

  interface GetUsers {
    Query: {
      username?: string
      firstName?: string
      lastName?: string
      limit?: string
      offset?: string
    }
    RequestBody: never
    ResponseBody: User[] | ErrorBody
  }

  interface Logout {
    RequestBody: never
    ResponseBody: undefined | ErrorBody
  }
}
