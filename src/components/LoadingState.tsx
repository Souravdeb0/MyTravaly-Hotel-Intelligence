export function DashboardSkeleton() {
  return (
    <div className="skeleton-layout" aria-label="Loading hotel analytics">
      <div className="skeleton skeleton--hero" />
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((item) => (
          <div className="skeleton skeleton--metric" key={item} />
        ))}
      </div>
      <div className="skeleton-grid skeleton-grid--charts">
        <div className="skeleton skeleton--chart" />
        <div className="skeleton skeleton--chart" />
      </div>
      <div className="skeleton skeleton--table" />
    </div>
  )
}
