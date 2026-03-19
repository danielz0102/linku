import { test as base } from "vitest"

import type { TestUserDB } from "~tests/helpers/db/test-user-db.ts"

import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"

export const it = base.extend("db", { scope: "file" }, async () => {
  return new DrizzleTestUserDB() as TestUserDB
})
