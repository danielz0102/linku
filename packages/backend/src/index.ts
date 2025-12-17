import app from "./app.js"
import { PORT } from "./config/index.js"
import logger from "./config/logger.js"

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${String(PORT)}`)
})
