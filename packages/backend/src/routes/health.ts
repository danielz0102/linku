import { Router, type Request, type Response } from "express"

const router = Router()

router.get("/health", (_: Request, res: Response) => {
  res.status(200).send()
})

export default router
