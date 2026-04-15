import { logOut } from "./actions/log-out"
import { login } from "./actions/login"
import { signUp } from "./actions/sign-up"
import { whoami } from "./actions/whoami"

export const api = {
  users: { whoami, login, signUp, logOut },
}
