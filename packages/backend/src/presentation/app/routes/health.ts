import { Router, type Response } from "express"

const router = Router()

router.get("/health", (_, res: Response) => {
  res.sendStatus(200)
})

export default router
