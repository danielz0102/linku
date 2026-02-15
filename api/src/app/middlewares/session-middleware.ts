import {
  SESSION_MAX_AGE,
  SESSION_SECRET,
  SESSION_SECURE,
} from "#shared/config/env.js"
import { SESSION_COOKIE_NAME } from "#shared/constants/session.js"
import { redisStore } from "#shared/db/redis/session-store.js"
import session from "express-session"

export const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: SESSION_SECURE,
    httpOnly: true,
    sameSite: SESSION_SECURE ? "none" : "lax",
    maxAge: SESSION_MAX_AGE,
  },
})
