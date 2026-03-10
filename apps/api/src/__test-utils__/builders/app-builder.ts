import express from "express"
import session from "express-session"

export class AppBuilder {
  private app: express.Express

  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  withSession() {
    this.app.use(
      session({
        secret: "test-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          sameSite: "none",
        },
      })
    )
    return this
  }

  withAuthenticatedUser(userId: string) {
    this.app.use((req, _res, next) => {
      req.session.userId = userId
      next()
    })
    return this
  }

  build() {
    return this.app
  }
}
