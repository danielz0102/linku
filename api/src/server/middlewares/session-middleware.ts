import { RedisStore } from "connect-redis"
import session from "express-session"

import { redisClient } from "#db/redis/redis-client.ts"
import { COOKIE_HTTPS, SESSION_SECRET } from "#env.ts"

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "linku:sess:",
})

export const sessionMiddleware = session({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_HTTPS,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
})
