import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull().unique(),
  hashedPassword: text().notNull(),
  firstName: varchar({ length: 50 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  profilePicUrl: text(),
  bio: text(),
})
