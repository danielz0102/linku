export type MessageData = {
  id: string
  senderId: string
  isRead: boolean
  createdAt: Date
} & MessageContent

type MessageContent =
  | {
      type: "text-only"
      text: string
      attachmentUrl?: never
    }
  | {
      type: "attachment-only"
      text?: never
      attachmentUrl: string
    }
  | {
      type: "text-and-attachment"
      text: string
      attachmentUrl: string
    }

export function formatMessageDate(date: Date): string {
  const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions()

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}
