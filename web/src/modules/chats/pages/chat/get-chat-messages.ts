import type { Message } from "../../domain/message"

export async function getMessages(peerUsername: string): Promise<Message[]> {
  void peerUsername
  return []
}
