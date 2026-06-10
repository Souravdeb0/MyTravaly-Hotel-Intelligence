interface RingProps {
  value: number
  label: string
  color: string
}

function Ring({ value, label, color }: RingProps) {
  return (
    <div className="ring-stat">
      <div
        className="ring-stat__chart"
        style={{
          background: `conic-gradient(${color} ${value * 3.6}deg, #f3dfdb 0deg)`,
        }}
        role="img"
        aria-label={`${label}: ${value}%`}
      >
        <span>{value}%</span>
      </div>
      <div>
        <strong>{label}</strong>
        <small>
          {label === 'Occupancy' ? 'Rooms in use' : 'Visits to stays'}
        </small>
      </div>
    </div>
  )
}

interface PerformanceRingsProps {
  occupancy: number
  conversion: number
}

export function PerformanceRings({
  occupancy,
  conversion,
}: PerformanceRingsProps) {
  return (
    <div className="performance-rings">
      <Ring value={occupancy} label="Occupancy" color="#ff6f61" />
      <Ring value={conversion} label="Conversion" color="#352a28" />
    </div>
  )
}
