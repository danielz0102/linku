import { getUser } from "./actions/get-user"

export const api = {
  users: {
    get: getUser,
  },
}
