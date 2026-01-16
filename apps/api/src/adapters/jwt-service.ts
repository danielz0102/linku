import jwt from "jsonwebtoken"
import { TokenService } from "#ports/token-service.js"

export class JwtService extends TokenService {
  override signToken(payload: object, expiresIn: number): Promise<string> {
    const { promise, reject, resolve } = Promise.withResolvers<string>()

    jwt.sign(payload, this.secretKey, { expiresIn }, (err, token) => {
      if (err || !token) {
        return reject(err || new Error("Token is undefined"))
      }

      resolve(token)
    })

    return promise
  }

  override verifyToken(token: string): Promise<object> {
    const { promise, reject, resolve } = Promise.withResolvers<object>()

    jwt.verify(token, this.secretKey, (err, decoded) => {
      if (err || !decoded) {
        return reject(err || new Error("Decoded token is undefined"))
      }

      if (typeof decoded === "string") {
        return reject(new Error("Decoded token is a string"))
      }

      resolve(decoded)
    })

    return promise
  }
}
