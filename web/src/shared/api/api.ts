import { getUser } from "./actions/get-user"
import { searchUsers } from "./actions/search-users"

export const api = {
  users: {
    search: searchUsers,
    get: getUser,
  },
}
