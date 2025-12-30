import { Router } from "express"
import { handleNotFound } from "~/middlewares/handle-not-found.js"
import { handleUnexpectedError } from "~/middlewares/handle-unexpected-error.js"

const router = Router()

router.get("/health", (_, res) => {
  res.sendStatus(200)
})

router.use(handleNotFound)
router.use(handleUnexpectedError)

export default router
