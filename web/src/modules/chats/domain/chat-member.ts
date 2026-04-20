export class ChatMember {
  readonly id: string
  readonly name: string
  readonly profilePictureUrl: string | null

  private constructor(id: string, name: string, profilePictureUrl: string | null) {
    this.id = id
    this.name = name
    this.profilePictureUrl = profilePictureUrl
  }

  static create(data: { id: string; name: string; profilePictureUrl: string | null }) {
    return new ChatMember(data.id, data.name, data.profilePictureUrl)
  }

  get initials(): string {
    const names = this.name.split(" ")
    const initials = names.map((n) => n[0]).join("")
    return initials.toUpperCase()
  }
}
