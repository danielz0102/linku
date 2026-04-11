export abstract class PasswordHasher {
  constructor(protected readonly salt: number) {}

  abstract hash(password: string): Promise<string>
  abstract compare(password: string, hashedPassword: string): Promise<boolean>
}
