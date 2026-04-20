export class ChatDate {
  #date: Date

  constructor(date: Date) {
    this.#date = date
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
