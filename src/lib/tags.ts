/**
 * Format a tag like "zero-waste" into "Zero waste" for display.
 * Capitalises only the first word so multi-word tags read naturally.
 */
export function formatTag(tag: string): string {
  if (!tag) return ''
  const words = tag.replace(/-/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * Format a list of tags as a comma-separated readable string.
 * Returns null if the list is empty so callers can decide whether to render anything.
 */
export function formatTagList(tags: string[] | null | undefined, max = 4): string | null {
  if (!tags || tags.length === 0) return null
  const formatted = tags.slice(0, max).map(formatTag).filter(Boolean)
  if (formatted.length === 0) return null
  return formatted.join(', ')
}
