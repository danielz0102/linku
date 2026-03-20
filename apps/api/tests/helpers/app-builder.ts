import express from "express"
import session from "express-session"

export function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use(
    session({
      secret: "test-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  )
  return app
}
