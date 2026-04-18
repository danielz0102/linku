import { RedisStore } from "connect-redis"
import session from "express-session"

import { redisClient } from "#db/redis/redis-client.ts"
import { SESSION_COOKIE_IS_HTTPS, SESSION_SECRET } from "#env.ts"
import { SESSION_COOKIE_NAME } from "#shared/session.ts"

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "linku:sess:",
})

export const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: SESSION_COOKIE_IS_HTTPS,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
})
