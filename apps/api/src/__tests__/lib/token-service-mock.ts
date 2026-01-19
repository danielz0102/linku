import { TokenService } from "#application/ports/token-service.js"
import { vi } from "vitest"

class TokenServiceMock extends TokenService {
  override signToken = vi.fn<TokenService["signToken"]>()
  override verifyToken = vi.fn<TokenService["verifyToken"]>()
  override signAuthTokens = vi.fn<TokenService["signAuthTokens"]>()
}

export function createTokenServiceMock(secret = "secret") {
  return new TokenServiceMock(secret)
}
