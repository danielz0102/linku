import { loadEnvFile, env } from "node:process"

loadEnvFile()

export const { DB_URL } = {
  DB_URL: env["DB_URL"]!,
}
