const insights = [
  {
    id: 1,
    type: 'growth',
    icon: 'trending_up',
    title: 'Regional Growth Surge',
    description: 'Regional growth in North America is up 15% due to the recent firmware update driving higher enterprise adoption.',
    timestamp: '2 min ago',
    color: 'tertiary',
  },
  {
    id: 2,
    type: 'warning',
    icon: 'warning',
    title: 'Churn Risk Detected',
    description: 'Identify potential churn in the APAC market. Signal detected in customer support ticket volume increase (24% WoW).',
    timestamp: '18 min ago',
    color: 'error',
  },
  {
    id: 3,
    type: 'restock',
    icon: 'inventory',
    title: 'Inventory Alert',
    description: 'Optimal restocking alert. Current inventory for Neural Processor X1 is projected to deplete in 12 days.',
    timestamp: '1 hour ago',
    color: 'secondary',
  },
]

import { useNavigate } from 'react-router-dom'

export default function AIInsightsPanel() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="ai-insights-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-headline-sm text-on-surface">AI Insights</h3>
          <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-surface-container">
            <div className="pulse-dot"></div>
            <span className="text-label-sm text-tertiary font-body">Intelligence Live</span>
          </div>
        </div>
        <button onClick={() => navigate('/exploration')} className="btn-ghost text-label-md py-1.5 px-3">View All</button>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className="ai-insight-card p-4 hover:scale-[1.01] transition-transform cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            id={`insight-${insight.id}`}
            onClick={() => navigate('/exploration', { state: { query: insight.title } })}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                insight.color === 'tertiary' ? 'bg-tertiary/10' :
                insight.color === 'error' ? 'bg-error/10' : 'bg-secondary/10'
              }`}>
                <span className={`material-symbols-outlined text-[18px] ${
                  insight.color === 'tertiary' ? 'text-tertiary' :
                  insight.color === 'error' ? 'text-error' : 'text-secondary'
                }`}>
                  {insight.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-title-md text-on-surface font-display">{insight.title}</h4>
                  <span className="text-label-sm text-outline font-body shrink-0 ml-2">{insight.timestamp}</span>
                </div>
                <p className="text-body-sm text-on-surface-variant font-body leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(68, 71, 76, 0.1)' }}>
        <h4 className="text-label-lg text-on-surface-variant font-body mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Live Activity
        </h4>
        <div className="space-y-2">
          {[
            { action: 'New CSV uploaded', detail: 'sales_q3_2024.csv', time: 'Just now' },
            { action: 'Report generated', detail: 'Weekly Performance Review', time: '5m ago' },
            { action: 'Query executed', detail: '"Top products by margin"', time: '12m ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                <span className="text-body-sm text-on-surface font-body">{item.action}</span>
                <span className="text-body-sm text-on-surface-variant font-body">— {item.detail}</span>
              </div>
              <span className="text-label-sm text-outline font-body">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
