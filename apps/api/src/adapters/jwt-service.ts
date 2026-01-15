import jwt from "jsonwebtoken"
import { TokenService } from "#ports/token-service.js"

export class JwtService extends TokenService {
  override accessToken(payload: object): Promise<string> {
    const { promise, reject, resolve } = Promise.withResolvers<string>()

    jwt.sign(payload, this.secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err || !token) {
        return reject(err || new Error("Token is undefined"))
      }

      resolve(token)
    })

    return promise
  }
}
