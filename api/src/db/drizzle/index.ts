import { drizzle } from "drizzle-orm/node-postgres"
import { DB_URL, NODE_ENV, TEST_DB_URL } from "~/config/env.js"

export default drizzle(NODE_ENV === "test" ? TEST_DB_URL : DB_URL)
