import { drizzle } from "drizzle-orm/node-postgres"

import { DATABASE_URL } from "#env.js"

export type Database = ReturnType<typeof drizzle>
export const db = drizzle(DATABASE_URL)
