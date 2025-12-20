import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true })

const envSchema = z
  .enum(["development", "production", "test"])
  .default("development")

const NODE_ENV = envSchema.parse(process.env.NODE_ENV)

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  SALT: z.number().default(10),
  JWT_SECRET: z.string().nonempty(),
})

export const { PORT, CLIENT_ORIGIN, DATABASE_URL, SALT, JWT_SECRET } =
  configSchema.parse({
    PORT: process.env.PORT,
    CLIENT_ORIGIN: getClientOrigin(),
    DATABASE_URL: getDbUrl(),
    SALT: getSalt(),
    JWT_SECRET: process.env.JWT_SECRET,
  })

function getClientOrigin() {
  if (NODE_ENV === "production") {
    return process.env.CLIENT_ORIGIN
  }

  return "*"
}

function getDbUrl() {
  if (NODE_ENV === "test") {
    return process.env.TEST_DB_URL
  }

  return process.env.DATABASE_URL
}

function getSalt() {
  if (NODE_ENV === "test") return 1
  if (NODE_ENV === "production") return 12

  return 10
}
