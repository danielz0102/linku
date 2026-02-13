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

  build() {
    return this.app
  }
}
