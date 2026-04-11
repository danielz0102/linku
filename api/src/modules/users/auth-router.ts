import { router } from "../../shared/trpc.ts"
import { signUp } from "./commands/sign-up/sign-up-procedure.ts"

export const auth = router({ signUp })
