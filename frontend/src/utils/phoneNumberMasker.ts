/**
 * Masks a phone number showing only the first 4 digits followed by '******'.
 * e.g. '9876543210' → '9876******'
 * Handles short or invalid numbers gracefully.
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.trim().length === 0) return '**********';
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return cleaned.padEnd(cleaned.length + 6, '*');
  return cleaned.slice(0, 4) + '******';
}
