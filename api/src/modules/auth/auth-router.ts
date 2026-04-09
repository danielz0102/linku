import { router } from "../../shared/trpc.ts"
import { signUp } from "./procedures/sign-up-procedure.ts"

export const auth = router({ signUp })
