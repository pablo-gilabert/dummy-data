// Converts a category name or slug into a human-readable title.
export const formatCategory = (category: string): string => {

  return category
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => (
      word.charAt(0).toUpperCase() + word.slice(1)
    ))
    .join(" ")
}