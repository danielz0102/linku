import { Router } from "express"
import { handle500 } from "~/middlewares/handle500.js"
import { handle404 } from "~/middlewares/handle404.js"
import healthRouter from "./health.js"

const router = Router()

router.use(healthRouter)
router.use(handle404)
router.use(handle500)

export default router
