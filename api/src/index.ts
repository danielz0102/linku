import { PORT } from "#env.ts"
import { createAppServer } from "#server/create-app-server.ts"
import { createWsServer } from "#server/create-ws-server.ts"

const server = await createAppServer()
const io = createWsServer(server)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

io.on("connection", (socket) => {
  console.log("A user connected", socket.id)
})
