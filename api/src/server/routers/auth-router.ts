import { signUpProcedure } from "#modules/users/commands/sign-up/sign-up-procedure.ts"
import { router } from "#shared/trpc.ts"

export const auth = router({ signUp: signUpProcedure })
