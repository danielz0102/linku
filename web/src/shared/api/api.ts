import { getCloudinarySignature } from "./actions/get-cloudinary-signature"
import { getUser } from "./actions/get-user"
import { logOut } from "./actions/log-out"
import { searchUsers } from "./actions/search-users"
import { signUp } from "./actions/sign-up"
import { updateUser } from "./actions/update-user"
import { whoami } from "./actions/whoami"

export const api = {
  users: {
    whoami,
    signUp,
    logOut,
    update: updateUser,
    getCloudinarySignature,
    search: searchUsers,
    get: getUser,
  },
}
