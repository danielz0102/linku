import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import { test as base } from "vitest"

import type { TestUserDB } from "~tests/helpers/db/test-user-db.ts"

import { DATABASE_URL } from "~/env.ts"
import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"

export const it = base
  .extend("dbClient", { scope: "file" }, async ({}, { onCleanup }) => {
    const schemaName = `test_${crypto.randomUUID().slice(0, 8)}`
    const pool = new Pool({ connectionString: DATABASE_URL })

    await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
    await pool.query(`SET search_path TO "${schemaName}"`)

    const db = drizzle(pool)

    await migrate(db, {
      migrationsFolder: "./drizzle",
      migrationsSchema: schemaName,
    })

    onCleanup(async () => {
      await pool.query(`DROP SCHEMA "${schemaName}" CASCADE`)
      await pool.end()
    })

    return db
  })
  .extend("db", async ({ dbClient }) => {
    return new DrizzleTestUserDB(dbClient) as TestUserDB
  })
