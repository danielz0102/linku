import { SESSION_COOKIE_NAME } from "#shared/trpc.ts"
import { authRouter } from "#server/routers/auth-router.ts"

authRouter.post("/logout", async (req, res) => {
  if (!req.session.userId) {
    res.sendStatus(204)
    return
  }

  try {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      })
    })
  } catch (error) {
    console.error("Error destroying session:", error)
    res.status(500).json({ message: "Failed to logout" })
    return
  }

  res.clearCookie(SESSION_COOKIE_NAME)
  res.sendStatus(204)
})
