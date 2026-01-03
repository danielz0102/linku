import { drizzle } from "drizzle-orm/node-postgres"
import { DB_URL } from "~/config/env.js"

export default drizzle(DB_URL)
