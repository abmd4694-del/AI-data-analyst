export default function MetricCard({ icon, label, value, change, changeType = 'positive', prefix = '' }) {
  const isPositive = changeType === 'positive'

  return (
    <div className="metric-card group animate-slide-up" id={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
        </div>
        {change && (
          <span className={`inline-flex items-center gap-1 text-label-md font-body ${isPositive ? 'text-tertiary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-[16px]">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {change}
          </span>
        )}
      </div>
      <p className="text-label-md text-on-surface-variant font-body mb-1">{label}</p>
      <p className="font-display text-display-sm text-on-surface">
        {prefix}{value}
      </p>
    </div>
  )
}
