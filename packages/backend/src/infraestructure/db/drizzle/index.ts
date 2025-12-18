import { DATABASE_URL } from "~/infraestructure/config/env.js"
import { drizzle } from "drizzle-orm/node-postgres"

export default drizzle(DATABASE_URL)
