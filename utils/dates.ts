const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Parse a date value for display. A date-only ISO string ("2025-02-14") is parsed as LOCAL
 * midnight, not UTC midnight — otherwise viewers west of Greenwich see the previous day.
 */
export function parseDate(value: string | number | Date | null | undefined): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') return new Date(value < 1e12 ? value * 1000 : value)
  if (DATE_ONLY.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const LOCALE = 'en-GB'

export function formatDate(value: string | number | Date | null | undefined, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
  const date = parseDate(value)
  return date ? date.toLocaleDateString(LOCALE, options) : ''
}

export function formatDateTime(value: string | number | Date | null | undefined, options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }): string {
  const date = parseDate(value)
  return date ? date.toLocaleString(LOCALE, options) : ''
}

/** Machine-readable value for <time datetime>. */
export function isoDate(value: string | number | Date | null | undefined): string {
  const date = parseDate(value)
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Whole days from now until a unix-seconds timestamp (negative if past). */
export function daysFromNow(unixSeconds: number, now: Date = new Date()): number {
  return Math.round((unixSeconds * 1000 - now.getTime()) / 86_400_000)
}

export function relativeDays(days: number): string {
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  return days > 0 ? `in ${days} days` : `${-days} days ago`
}
