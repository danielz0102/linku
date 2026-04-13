import { loginProcedure } from "#modules/users/commands/login/login-procedure.ts"
import { logoutProcedure } from "#modules/users/commands/logout.ts/logout-procedure.ts"
import { signUpProcedure } from "#modules/users/commands/sign-up/sign-up-procedure.ts"
import { whoamiProcedure } from "#modules/users/queries/whoami/whoami-procedure.ts"
import { router } from "#shared/trpc.ts"

export const auth = router({
  signUp: signUpProcedure,
  login: loginProcedure,
  logout: logoutProcedure,
  whoami: whoamiProcedure,
})
