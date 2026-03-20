import session from "express-session"

import { SESSION_MAX_AGE, SESSION_SECRET, SESSION_SECURE } from "#env.js"

import { redisStore } from "../../db/redis/session-store.js"
import { SESSION_COOKIE_NAME } from "./constants.js"

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
