import express from "express"
import session from "express-session"

import { unexpectedError } from "~/server/middlewares/unexpected-error.ts"

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
          secure: false,
          httpOnly: true,
          sameSite: "lax",
        },
      })
    )
    return this
  }

  build() {
    this.app.use(unexpectedError)
    return this.app
  }
}
