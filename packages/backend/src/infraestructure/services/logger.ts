import pino from "pino"
import { NODE_ENV } from "../config/env.js"

const productionLogger = pino()

const developmentLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
})

export default NODE_ENV === "production" ? productionLogger : developmentLogger
