import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

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

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  senderId: uuid()
    .notNull()
    .references(() => usersTable.id),
  receiverId: uuid()
    .notNull()
    .references(() => usersTable.id),
  content: text().notNull(),
  timestamp: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
