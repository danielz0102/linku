export type ChatMemberData = {
  id: string
  username: string
  name: string
  profilePicURL: string | null
}

export function getInitials(fullname: string): string {
  const names = fullname.split(" ")
  const initials = names.map((n) => n[0]).join("")
  return initials.toUpperCase()
}
