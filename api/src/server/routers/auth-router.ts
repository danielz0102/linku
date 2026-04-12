import { loginProcedure } from "#modules/users/commands/login/login-procedure.ts"
import { signUpProcedure } from "#modules/users/commands/sign-up/sign-up-procedure.ts"
import { router } from "#shared/trpc.ts"

export const auth = router({ signUp: signUpProcedure, login: loginProcedure })
