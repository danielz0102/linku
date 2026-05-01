export class ChatMember {
  readonly id: string
  readonly username: string
  readonly name: string
  readonly profilePictureUrl: string | null

  private constructor(
    id: string,
    username: string,
    name: string,
    profilePictureUrl: string | null
  ) {
    this.id = id
    this.username = username
    this.name = name
    this.profilePictureUrl = profilePictureUrl
  }

  static create(data: {
    id: string
    username: string
    name: string
    profilePictureUrl: string | null
  }) {
    return new ChatMember(data.id, data.username, data.name, data.profilePictureUrl)
  }

  get initials(): string {
    const names = this.name.split(" ")
    const initials = names.map((n) => n[0]).join("")
    return initials.toUpperCase()
  }
}

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
