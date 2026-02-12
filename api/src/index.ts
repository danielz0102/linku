import { notFound } from "#middlewares/not-found.js"
import { unexpectedError } from "#middlewares/unexpected-error.js"
import { usersRouter } from "#users/index.js"
import { RedisStore } from "connect-redis"
import cors from "cors"
import express from "express"
import session from "express-session"
import { ALLOWED_ORIGIN, PORT, SESSION_SECRET } from "./config/env.js"
import redisClient from "#db/redis/index.js"

const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))

try {
  await redisClient.connect()
} catch (error) {
  console.error(
    "Failed to connect to Redis. Verify REDIS_URL is set correctly and Redis is accessible.",
    error
  )
  process.exit(1)
}

const redisStore = new RedisStore({ client: redisClient })
app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
)

app.use("/users", usersRouter)

app.use(notFound)
app.use(unexpectedError)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
