import { Router, type Response } from "express"

const router = Router()

router.get("/health", (_, res: Response) => {
  res.status(200).send()
})

export default router
