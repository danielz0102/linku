import { pgTable, uuid, varchar, pgEnum } from "drizzle-orm/pg-core"

export const userStatus = pgEnum("user_status", ["online", "offline"])

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 100 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  profilePicUrl: varchar("profile_pic_url", { length: 255 }),
  status: userStatus().default("offline"),
})
