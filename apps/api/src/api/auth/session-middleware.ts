import session from "express-session"

import { SESSION_MAX_AGE, SESSION_SECRET, SESSION_SECURE } from "#env.js"

import { SESSION_COOKIE_NAME } from "./constants/session.js"
import { redisStore } from "./redis/session-store.js"

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
