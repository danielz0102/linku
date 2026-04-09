import { PORT } from "./env.ts"
import { createAppServer } from "./server/create-app-server.ts"

const server = createAppServer()

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
