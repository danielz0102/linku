import app from "./presentation/app/index.js"
import { PORT } from "./infraestructure/config/env.js"
import logger from "./infraestructure/config/logger.js"

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${String(PORT)}`)
})
