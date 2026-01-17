import type {
  LoginPayload,
  RegisterCredentials,
} from "#domain/entities/user.d.js"
import type { FileService } from "#ports/file-service.d.js"
import type { PasswordHasher } from "#ports/password-hasher.js"
import type { TokenService } from "#ports/token-service.js"
import type { UserRepository } from "#ports/user-repository.d.js"

import { toPublicUser } from "#domain/entities/user-mapper.js"
import { Result } from "#lib/result.js"

type Dependencies = {
  repo: UserRepository
  hasher: PasswordHasher
  tokenService: TokenService
  fileService: FileService
}

export class RegisterWithCredentials {
  private readonly repo: UserRepository
  private readonly hasher: PasswordHasher
  private readonly tokenService: TokenService
  private readonly fileService: FileService

  constructor({ repo, hasher, tokenService, fileService }: Dependencies) {
    this.repo = repo
    this.hasher = hasher
    this.tokenService = tokenService
    this.fileService = fileService
  }

  async execute({
    username,
    email,
    firstName,
    lastName,
    password,
    profilePicture,
  }: RegisterCredentials): Promise<Result<LoginPayload>> {
    const existingUser = await this.repo.findBy({ username, email })

    if (existingUser) {
      return Result.fail(new Error("User already exists"))
    }

    const hashedPassword = await this.hasher.hash(password)

    let profilePicUrl: string | undefined
    if (profilePicture) {
      profilePicUrl = await this.fileService.uploadFile(profilePicture)
    }

    const newUser = await this.repo.create({
      username,
      email,
      firstName,
      lastName,
      hashedPassword,
      profilePicUrl,
    })
    const { accessToken, refreshToken } =
      await this.tokenService.signAuthTokens(newUser.id)

    return Result.ok({
      user: toPublicUser(newUser),
      accessToken,
      refreshToken,
    })
  }
}
