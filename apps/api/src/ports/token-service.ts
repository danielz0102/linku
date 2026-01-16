export abstract class TokenService {
  constructor(protected readonly secretKey: string) {}

  abstract signToken(payload: object, seconds: number): Promise<string>
  abstract verifyToken(token: string): Promise<object>
}
