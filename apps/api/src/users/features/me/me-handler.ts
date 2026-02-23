import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import type { ErrorBody, PublicUser } from "@linku/api-contract"
import type { Request, Response } from "express"

export const meHandler = (repository: UserRepository) => {
  return async (
    req: Request,
    res: Response<PublicUser | ErrorBody>
  ): Promise<Response<PublicUser | ErrorBody>> => {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      })
    }

    const user = await repository.search({ id: userId })

    if (!user) {
      throw new Error("User with session not found in database", {
        cause: { userId },
      })
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profilePicUrl: user.profilePicUrl,
    })
  }
}
