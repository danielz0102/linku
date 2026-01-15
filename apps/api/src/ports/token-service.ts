export abstract class TokenService {
  constructor(protected readonly secretKey: string) {}

  abstract accessToken(payload: object): Promise<string>
}
