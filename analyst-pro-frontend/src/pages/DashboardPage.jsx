import { useNavigate } from 'react-router-dom'
import MetricCard from '../components/dashboard/MetricCard'
import SalesTrendChart from '../components/dashboard/SalesTrendChart'
import TopProductsChart from '../components/dashboard/TopProductsChart'
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel'

const metrics = [
  { icon: 'payments', label: 'Total Revenue', value: '2.48M', change: '+12.4%', changeType: 'positive', prefix: '$' },
  { icon: 'shopping_cart', label: 'Avg Order Value', value: '142.00', change: '+3.2%', changeType: 'positive', prefix: '$' },
  { icon: 'conversion_path', label: 'Conversion Rate', value: '24.5%', change: '+4.0%', changeType: 'positive' },
  { icon: 'group', label: 'Active Users', value: '18.2k', change: '-1.8%', changeType: 'negative' },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6" id="dashboard-page">
      {/* AI Announcement Banner */}
      <div className="ai-insight-card p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] text-secondary">auto_awesome</span>
          </div>
          <div className="flex-1">
            <p className="text-title-md text-secondary font-display mb-1">
              &ldquo;We&rsquo;ve detected an anomalous 12.4% surge in retention within the North American market.&rdquo;
            </p>
            <p className="text-body-sm text-on-surface-variant font-body leading-relaxed">
              The recent trend appears linked to the Product Update 4.2 rollout. Conversion rate is tracking 4% above the moving average.
              Recommendation: Shift 15% of the marketing budget to targeted re-engagement campaigns for the California region.
            </p>
          </div>
          <button onClick={() => navigate('/exploration')} className="btn-ghost text-label-sm py-1.5 px-3 shrink-0">Explore</button>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} onClick={() => navigate('/exploration')} className="cursor-pointer hover:scale-[1.02] transition-transform">
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendChart />
        <TopProductsChart />
      </div>

      {/* AI Insights + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights — takes 2 columns */}
        <div className="lg:col-span-2">
          <AIInsightsPanel />
        </div>

        {/* Right sidebar — Alerts + Actions */}
        <div className="space-y-4">
          {/* AI Alerts */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up">
            <h3 className="font-display text-title-lg text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[20px] text-error">notifications_active</span>
              Recent AI Alerts
            </h3>
            <div className="space-y-3">
              {[
                { text: 'API Latency exceeding threshold in US-East-1', severity: 'high', link: '/settings' },
                { text: 'Unused cloud resources identified ($450/mo savings)', severity: 'medium', link: '/reports' },
                { text: "Viral referral link detected from 'techcrunch.com'", severity: 'info', link: '/exploration' },
              ].map((alert, i) => (
                <button key={i} onClick={() => navigate(alert.link)} className="w-full flex items-start gap-2.5 py-2 text-left hover:bg-surface-container/50 rounded px-2 -mx-2 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.severity === 'high' ? 'bg-error' :
                    alert.severity === 'medium' ? 'bg-primary' : 'bg-tertiary'
                  }`}></div>
                  <p className="text-body-sm text-on-surface-variant font-body hover:text-on-surface transition-colors">{alert.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up">
            <h3 className="font-display text-title-lg text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[20px] text-primary">lightbulb</span>
              Suggested Actions
            </h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/settings')} className="w-full text-left p-3 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                <h4 className="text-title-md text-on-surface font-display mb-1 group-hover:text-primary transition-colors">Optimize Cloud Budget</h4>
                <p className="text-body-sm text-on-surface-variant font-body">Scaling down inactive dev instances could save 12% annually.</p>
              </button>
              <button onClick={() => navigate('/reports')} className="w-full text-left p-3 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                <h4 className="text-title-md text-on-surface font-display mb-1 group-hover:text-primary transition-colors">Share Q3 Report</h4>
                <p className="text-body-sm text-on-surface-variant font-body">The quarterly report is ready for the stakeholders meeting.</p>
              </button>
            </div>
          </div>

          {/* Predictive Alert */}
          <button onClick={() => navigate('/data-sources')} className="w-full text-left bg-surface-container-low rounded-md p-5 animate-slide-up hover:bg-surface-container transition-colors" style={{ borderLeft: '3px solid #00e1ae' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">inventory_2</span>
              <h4 className="text-title-md text-tertiary font-display">Predictive Restock</h4>
            </div>
            <p className="text-body-sm text-on-surface-variant font-body">
              Based on current velocity, Electronics Category A will stock out in <strong className="text-on-surface">4 days</strong>.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
