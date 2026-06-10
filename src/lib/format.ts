const compactCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const fullCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(value: number, compact = false) {
  return (compact ? compactCurrency : fullCurrency).format(value)
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

export function formatRelativeTime(timestamp: number, currentTime = Date.now()) {
  const seconds = Math.max(0, Math.round((currentTime - timestamp) / 1000))
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  return `${Math.floor(seconds / 60)}m ago`
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
