// oxlint-disable import/no-unassigned-import
import "express-session"

declare module "express-session" {
  interface SessionData {
    userId: string
  }
}
