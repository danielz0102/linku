import { DB_URL } from "#infrastructure/config/env.js"
import { drizzle } from "drizzle-orm/node-postgres"

export default drizzle(DB_URL)
