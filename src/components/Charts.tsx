import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/format'
import type { TrendPoint } from '../types'

interface ChartsProps {
  data: TrendPoint[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.name}>
          <i style={{ backgroundColor: item.color }} />
          {item.name}:&nbsp;
          {item.name === 'Revenue'
            ? formatCurrency(item.value)
            : item.value.toLocaleString('en-IN')}
        </span>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: ChartsProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <AreaChart data={data} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6f61" stopOpacity={0.34} />
            <stop offset="100%" stopColor="#ff6f61" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ead7d3" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#786965', fontFamily: 'DM Sans', fontSize: 12 }} dy={8} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#786965', fontFamily: 'DM Sans', fontSize: 11 }} tickFormatter={(value: number) => formatCurrency(value, true)} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#ff6f61' }} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#ff6f61" strokeWidth={3} fill="url(#revenueFill)" activeDot={{ r: 5, fill: '#fffaf8', strokeWidth: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BookingsChart({ data }: ChartsProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#ead7d3" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#786965', fontFamily: 'DM Sans', fontSize: 12 }} dy={8} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#786965', fontFamily: 'DM Sans', fontSize: 11 }} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8e5e1' }} />
        <Bar dataKey="bookings" name="Bookings" fill="#352a28" radius={[5, 5, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  )
}
