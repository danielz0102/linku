import { PORT } from "~/config/env.js"
import app from "./app.js"
import logger from "./services/logger.js"

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
