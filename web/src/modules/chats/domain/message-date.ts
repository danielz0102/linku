export class MessageDate {
  private date: Date

  constructor(date: Date | string) {
    this.date = typeof date === "string" ? new Date(date) : date
  }

  toISOString(): string {
    return this.date.toISOString()
  }

  format(): string {
    const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions()

    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "numeric",
      minute: "numeric",
    }).format(this.date)
  }
}
