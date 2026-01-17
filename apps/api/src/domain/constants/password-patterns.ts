export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  DIGIT: /[0-9]/,
  SPECIAL_CHAR: /[^A-Za-z0-9]/,
} as const

export const PASSWORD_MIN_LENGTH = 8
