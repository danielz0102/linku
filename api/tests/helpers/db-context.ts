import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import { test as base } from "vitest"

import { DB_URL } from "#env.ts"

// oxlint-disable-next-line no-empty-pattern
export const it = base.extend("db", { scope: "file" }, async ({}, { onCleanup }) => {
  const schemaName = `test_${crypto.randomUUID().slice(0, 8)}`
  const pool = new Pool({
    connectionString: DB_URL,
    options: `-c search_path="${schemaName}"`,
  })

  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
  const db = drizzle(pool)

  await migrate(db, { migrationsFolder: "./drizzle", migrationsSchema: schemaName })

  onCleanup(async () => {
    await pool.end()
  })

  return db
})
