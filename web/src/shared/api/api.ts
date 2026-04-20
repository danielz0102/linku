import { getCloudinarySignature } from "./actions/get-cloudinary-signature"
import { getUser } from "./actions/get-user"
import { logOut } from "./actions/log-out"
import { searchUsers } from "./actions/search-users"
import { updateUser } from "./actions/update-user"
import { whoami } from "./actions/whoami"

export const api = {
  users: {
    whoami,
    logOut,
    update: updateUser,
    getCloudinarySignature,
    search: searchUsers,
    get: getUser,
  },
}
