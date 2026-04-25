export class MessageDate {
  #date: Date

  constructor(date: string) {
    this.#date = new Date(date)
  }

  toISOString() {
    return this.#date.toISOString()
  }

  format() {
    const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions()

    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "numeric",
      minute: "numeric",
    }).format(this.#date)
  }
}
