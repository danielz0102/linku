import { createApp } from "#app.js"
import { composeAuthRouter } from "#composition.js"
import { PORT } from "#config/env.js"
import { createApiRouter } from "#routers/api-router.js"

const apiRouter = createApiRouter({
  authRouter: composeAuthRouter(),
})
const app = createApp(apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
