import { getUser } from "./actions/get-user"
import { searchUsers } from "./actions/search-users"
import { updateUser } from "./actions/update-user"

export const api = {
  users: {
    update: updateUser,
    search: searchUsers,
    get: getUser,
  },
}
