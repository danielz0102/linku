import { sql } from "drizzle-orm"
import {
  check,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  profilePictureId: uuid("profile_picture_id").references(() => files.id, { onDelete: "set null" }),
  bio: text(),
})

export const chats = pgTable("chats", {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.chatId, t.userId] })]
)

export const messages = pgTable(
  "messages",
  {
    id: uuid().primaryKey().defaultRandom(),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    text: text(),
    attachmentId: uuid("attachment_id").references(() => files.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "messages_content_or_attachment_check",
      sql`${table.text} IS NOT NULL OR ${table.attachmentId} IS NOT NULL`
    ),
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_chat_id_idx").on(table.chatId),
    index("messages_created_at_idx").on(table.createdAt),
  ]
)

export const messageReads = pgTable(
  "message_reads",
  {
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.messageId, table.userId] })]
)

export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  publicId: text("public_id").unique(),
  publicUrl: text("public_url"),
})
