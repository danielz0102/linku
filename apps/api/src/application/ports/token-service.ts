import { ACCESS_TOKEN_LIFE } from "#domain/constants/token-lifes.js"

export abstract class TokenService {
  constructor(protected readonly secretKey: string) {}

  abstract signToken(payload: object, seconds: number): Promise<string>
  abstract verifyToken(token: string): Promise<object>

  async signAcessToken(userId: string) {
    const accessToken = await this.signToken({ userId }, ACCESS_TOKEN_LIFE)
    return { accessToken }
  }
}
