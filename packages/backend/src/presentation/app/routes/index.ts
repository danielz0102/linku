import { Router } from "express"
import { handle404 } from "~/presentation/middlewares/handle-404.js"
import { handle500 } from "~/presentation/middlewares/handle-500.js"
import apiRouter from "./api.js"
import healthRouter from "./health.js"

const router = Router()

router.use("/api", apiRouter)
router.use(healthRouter)
router.use(handle404)
router.use(handle500)

export default router
