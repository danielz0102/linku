import { TOKEN_LIFES } from "#domain/constants/token-lifes.js"

export abstract class TokenService {
  constructor(protected readonly secretKey: string) {}

  abstract signToken(payload: object, seconds: number): Promise<string>
  abstract verifyToken(token: string): Promise<object>

  async signAuthTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken({ userId }, TOKEN_LIFES.ACCESS_TOKEN),
      this.signToken({ userId }, TOKEN_LIFES.REFRESH_TOKEN),
    ])
    return { accessToken, refreshToken }
  }
}
