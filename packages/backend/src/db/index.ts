import { DATABASE_URL } from "~/config/index.js"
import { drizzle } from "drizzle-orm/node-postgres"

export default drizzle(DATABASE_URL)
