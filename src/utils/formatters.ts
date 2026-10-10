import { format, parseISO, isValid } from 'date-fns'

export function formatDate(dateStr?: string | Date, pattern = 'MMM dd, yyyy'): string {
  if (!dateStr) return '-'
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    if (!isValid(d)) return typeof dateStr === 'string' ? dateStr : '-'
    return format(d, pattern)
  } catch {
    return typeof dateStr === 'string' ? dateStr : '-'
  }
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return '--:--'
  if (timeStr.includes('T')) {
    try {
      const d = parseISO(timeStr)
      if (isValid(d)) return format(d, 'hh:mm a')
    } catch {
      // fallback
    }
  }
  // If time format is HH:mm:ss or HH:mm
  const parts = timeStr.split(':')
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10)
    const minutes = parts[1]
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12
    return `${formattedHours}:${minutes} ${ampm}`
  }
  return timeStr
}

export function formatHours(hours?: number): string {
  if (hours === undefined || hours === null || isNaN(hours)) return '0h 0m'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getStatusBadgeVariant(status: string): {
  bg: string
  text: string
  border: string
} {
  const s = status.toLowerCase()
  if (['approved', 'present', 'paid', 'completed', 'active', 'open', 'resolved', 'on_track'].includes(s)) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    }
  }
  if (['pending', 'under_review', 'awaiting_info', 'in_progress', 'late', 'processing', 'interviewing', 'probation', 'at_risk'].includes(s)) {
    return {
      bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    }
  }
  if (['rejected', 'absent', 'behind', 'inactive', 'urgent', 'cancelled'].includes(s)) {
    return {
      bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
    }
  }
  // default / subtle
  return {
    bg: 'bg-surface-subtle text-text-secondary border-border',
    text: 'text-text-secondary',
    border: 'border-border',
  }
}
