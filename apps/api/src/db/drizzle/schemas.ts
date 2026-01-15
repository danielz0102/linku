import { sql } from "drizzle-orm"
import {
  bigint,
  check,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull().unique(),
  hashedPassword: varchar({ length: 255 }),
  firstName: varchar({ length: 50 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  profilePicId: uuid().references(() => attachmentsTable.id),
  status: varchar({ length: 50, enum: ["online", "offline"] })
    .default("online")
    .notNull(),
  bio: text(),
  signUpAt: timestamp().defaultNow().notNull(),
})

export type UserRecord = typeof usersTable.$inferSelect

export const friends = pgTable(
  "friends",
  {
    userId: uuid()
      .notNull()
      .references(() => usersTable.id),
    friendId: uuid()
      .notNull()
      .references(() => usersTable.id),
    since: timestamp().defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.friendId] }),
    check("no_self_friendship", sql`${table.userId} <> ${table.friendId}`),
  ]
)

export const identitiesTable = pgTable("user_identities", {
  id: uuid().primaryKey().defaultRandom(),
  sub: varchar({ length: 255 }).notNull(),
  provider: varchar({ length: 50 }).notNull(),
  issuer: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id),
})

export const attachmentsTable = pgTable(
  "attachments",
  {
    id: uuid().primaryKey().defaultRandom(),
    filename: varchar({ length: 255 }).notNull(),
    url: text().notNull(),
    size: bigint({ mode: "number" }).notNull(),
    uploadedAt: timestamp().defaultNow().notNull(),
    mimeType: varchar({ length: 100 }).notNull(),
  },
  (table) => [check("size_non_negative", sql`${table.size} >= 0`)]
)

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  text: text(),
  status: varchar({ length: 50, enum: ["sent", "read"] })
    .default("sent")
    .notNull(),
  sentAt: timestamp().defaultNow().notNull(),
  sentFrom: uuid()
    .notNull()
    .references(() => usersTable.id),
  sentTo: uuid()
    .notNull()
    .references(() => usersTable.id),
  attachmentId: uuid().references(() => attachmentsTable.id),
})
