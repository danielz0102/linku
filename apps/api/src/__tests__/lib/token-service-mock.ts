import { TokenService } from "#ports/token-service.js"
import { vi } from "vitest"

export function createTokenServiceMock(secret = "secret") {
  const TokenServiceMock = vi.fn(
    class extends TokenService {
      override accessToken = vi.fn()
    }
  )

  const tokenService = new TokenServiceMock(secret)
  return tokenService
}
