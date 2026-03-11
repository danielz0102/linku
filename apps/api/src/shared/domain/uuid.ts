import { v4 as uuidv4, validate } from "uuid"

export class UUID {
  readonly value: string

  constructor(value?: string) {
    if (!value) {
      this.value = uuidv4()
      return
    }

    if (!validate(value)) {
      throw new Error("Invalid UUID format")
    }

    this.value = value
  }
}
