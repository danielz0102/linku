import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  bio: text(),
})
