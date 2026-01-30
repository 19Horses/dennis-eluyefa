/**
 * Formats a date string (ISO 8601 format) to "MMM 'YY" format
 * Example: "2025-01-30" -> "Jan '25"
 * @param dateString - ISO 8601 date string (e.g., "2025-01-30")
 * @returns Formatted date string in "MMM 'YY" format
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${month} '${year}`;
};
