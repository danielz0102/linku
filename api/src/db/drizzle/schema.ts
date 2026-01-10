import { pgTable, uuid, varchar, primaryKey } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: varchar({ length: 255 }).notNull(),
})

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export const identitiesTable = pgTable(
  "user_identities",
  {
    sub: varchar({ length: 255 }).notNull(),
    provider: varchar({ length: 50 }).notNull(),
    userId: uuid()
      .notNull()
      .references(() => usersTable.id),
  },
  (table) => [primaryKey({ columns: [table.sub, table.provider] })]
)

export type Identity = typeof identitiesTable.$inferSelect
export type NewIdentity = typeof identitiesTable.$inferInsert
