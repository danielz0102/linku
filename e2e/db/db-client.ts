import postgres from "postgres"

import { DB_URL } from "../config.ts"

export const sql = postgres(DB_URL)
