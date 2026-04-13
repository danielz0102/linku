import { SESSION_COOKIE_NAME } from "#shared/trpc.ts"
import { authRouter } from "#server/routers/auth-router.ts"

authRouter.post("/logout", async (req, res) => {
  if (!req.session.userId) {
    res.sendStatus(204)
    return
  }

  await new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })

  res.clearCookie(SESSION_COOKIE_NAME)
  res.sendStatus(204)
})
