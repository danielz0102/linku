import { PORT } from "#infraestructure/config/env.js"
import { createApp } from "#presentation/app.js"
import { composeAuthRouter } from "#presentation/composition.js"
import { createApiRouter } from "#presentation/routers/api-router.js"

const apiRouter = createApiRouter({
  authRouter: composeAuthRouter(),
})
const app = createApp(apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
