import type { registrationSchema } from "#schemas/registration-schema.js"
import type { RequestHandler } from "express"
import type z from "zod"

import { SALT } from "#config/env.js"
import { UserRepository } from "#repositories/user-repository.js"
import { uploadImage } from "#services/upload-image.js"
import bcrypt from "bcryptjs"

type RegistrationBody = z.infer<typeof registrationSchema>["body"]

export const register: RequestHandler<
  unknown,
  unknown,
  RegistrationBody
> = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body

  const exists = await UserRepository.exists({ email, username })

  if (exists) {
    return res.status(409).json({ error: "Username or email already exists" })
  }

  const [picUrl, hashedPassword] = await Promise.all([
    (() => {
      if (req.file) {
        return uploadImage(req.file.buffer)
      }
    })(),
    bcrypt.hash(password, SALT),
  ])

  const user = await UserRepository.create({
    username,
    email,
    hashedPassword,
    firstName,
    lastName,
    profilePicUrl: picUrl,
  })

  res.send(user)
}
