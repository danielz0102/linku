import { SESSION_MAX_AGE, SESSION_SECRET } from "#shared/config/env.js"
import { redisStore } from "#shared/db/redis/session-store.js"
import session from "express-session"

export const sessionMiddleware = session({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: SESSION_MAX_AGE,
  },
})
