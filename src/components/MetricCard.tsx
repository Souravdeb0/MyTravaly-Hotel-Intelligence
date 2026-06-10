import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone?: 'ink' | 'coral' | 'sage' | 'sand'
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'sand',
}: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__top">
        <span>{label}</span>
        <span className="metric-card__icon">
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
