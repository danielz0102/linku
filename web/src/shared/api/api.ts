import { getCloudinarySignature } from "./actions/get-cloudinary-signature"
import { logOut } from "./actions/log-out"
import { login } from "./actions/login"
import { searchUsers } from "./actions/search-users"
import { signUp } from "./actions/sign-up"
import { updateUser } from "./actions/update-user"
import { whoami } from "./actions/whoami"

export const api = {
  users: { whoami, login, signUp, logOut, updateUser, getCloudinarySignature, search: searchUsers },
}
