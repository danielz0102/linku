import { eq } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"

import { files, messages, users } from "./schemas.ts"

export const usersView = pgView("users_view").as((qb) => {
  return qb
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      profilePictureUrl: files.publicUrl,
      bio: users.bio,
    })
    .from(users)
    .leftJoin(files, eq(files.id, users.profilePictureId))
})

export const messagesView = pgView("messages_view").as((qb) => {
  return qb
    .select({
      id: messages.id,
      chatId: messages.chatId,
      senderId: messages.senderId,
      text: messages.text,
      attachmentUrl: files.publicUrl,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .leftJoin(files, eq(files.id, messages.attachmentId))
})
