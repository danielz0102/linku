import { PORT } from "#env.ts"
import { createAppServer } from "#server/create-app-server.ts"
import { initWsServer } from "#server/init-ws-server.ts"

const server = createAppServer()
initWsServer(server)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
