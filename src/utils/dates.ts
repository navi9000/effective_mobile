export function isDateValid(input: unknown) {
  if (input === undefined) {
    return true
  }
  if (typeof input === "string") {
    const date = new Date(input)
    if (!isNaN(date.valueOf())) {
      return true
    }
  }
  return false
}
