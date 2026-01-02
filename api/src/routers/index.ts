import { Router } from "express"
import { handleNotFound } from "~/middlewares/handle-not-found.js"
import { handleUnexpectedError } from "~/middlewares/handle-unexpected-error.js"
import apiRouter from "./api-router.js"

const router = Router()

router.get("/health", (_, res) => {
  res.sendStatus(200)
})
router.use("/api", apiRouter)
router.use(handleNotFound)
router.use(handleUnexpectedError)

export default router
