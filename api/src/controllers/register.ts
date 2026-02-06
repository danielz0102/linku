import { SALT } from "#config/env.js"
import { UserRepository } from "#repositories/user-repository.js"
import { uploadImage } from "#services/upload-image.js"
import bcrypt from "bcryptjs"
import type { RequestHandler } from "express"

type Body = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

type Handler = RequestHandler<unknown, unknown, Body>

export const registerController: Handler = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body
  const exists = await UserRepository.exists({ email, username })

  if (exists) {
    return res.status(409).json({ message: "Username or email already exists" })
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

  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    pictureUrl: user.profilePicUrl,
  })
}
