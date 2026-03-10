import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core"

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

export const conversationsTable = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
  participantOneId: uuid()
    .notNull()
    .references(() => usersTable.id),
  participantTwoId: uuid()
    .notNull()
    .references(() => usersTable.id),
  lastMessageAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  conversationId: uuid()
    .notNull()
    .references(() => conversationsTable.id),
  senderId: uuid()
    .notNull()
    .references(() => usersTable.id),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
