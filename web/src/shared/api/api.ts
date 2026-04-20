import { getUser } from "./actions/get-user"
import { logOut } from "./actions/log-out"
import { searchUsers } from "./actions/search-users"
import { updateUser } from "./actions/update-user"

export const api = {
  users: {
    logOut,
    update: updateUser,
    search: searchUsers,
    get: getUser,
  },
}
