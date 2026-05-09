export type ChatMemberProps = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePicURL?: string | null
  lastReadAt?: Date | string | null
}

export class ChatMember {
  private constructor(
    readonly id: string,
    readonly username: string,
    readonly firstName: string,
    private lastName: string,
    readonly profilePicURL: string | null,
    readonly lastReadAt: Date | null
  ) {}

  static create(props: ChatMemberProps): ChatMember {
    const lastReadAt = props.lastReadAt
      ? props.lastReadAt instanceof Date
        ? props.lastReadAt
        : new Date(props.lastReadAt)
      : null

    return new ChatMember(
      props.id,
      props.username,
      props.firstName,
      props.lastName,
      props.profilePicURL ?? null,
      lastReadAt
    )
  }

  get initials(): string {
    const firstInitial = this.firstName.charAt(0).toUpperCase()
    const lastInitial = this.lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  get fullname(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
