import type { InferSelectModel } from "drizzle-orm"
import type { users } from "./schema.js"

import User from "~/domain/entities/user.js"
import { Email } from "~/domain/value-objects/email.js"

type UserModel = InferSelectModel<typeof users>

export const UserModelMapper = {
  toEntity(model: UserModel): User {
    return new User({
      id: model.id,
      username: model.username,
      email: new Email(model.email),
      passwordHash: model.passwordHash,
      profilePicUrl: model.profilePicUrl ?? undefined,
      status: model.status ?? undefined,
    })
  },
}
