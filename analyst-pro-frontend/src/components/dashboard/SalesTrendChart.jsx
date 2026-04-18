import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const data = [
  { month: 'Jan', revenue: 180000, lastYear: 150000 },
  { month: 'Feb', revenue: 220000, lastYear: 170000 },
  { month: 'Mar', revenue: 195000, lastYear: 185000 },
  { month: 'Apr', revenue: 280000, lastYear: 200000 },
  { month: 'May', revenue: 260000, lastYear: 195000 },
  { month: 'Jun', revenue: 310000, lastYear: 210000 },
  { month: 'Jul', revenue: 290000, lastYear: 225000 },
  { month: 'Aug', revenue: 350000, lastYear: 240000 },
  { month: 'Sep', revenue: 380000, lastYear: 260000 },
  { month: 'Oct', revenue: 420000, lastYear: 280000 },
  { month: 'Nov', revenue: 395000, lastYear: 290000 },
  { month: 'Dec', revenue: 450000, lastYear: 310000 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3">
        <p className="text-label-md text-on-surface-variant font-body mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-body-sm font-body" style={{ color: entry.color }}>
            {entry.name}: ${(entry.value / 1000).toFixed(0)}k
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function SalesTrendChart() {
  return (
    <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="sales-trend-chart">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-headline-sm text-on-surface">Monthly Sales Trend</h3>
          <p className="text-body-sm text-on-surface-variant font-body mt-1">
            Performance comparison across Q3 — Q4
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded-full bg-primary"></div>
            <span className="text-label-sm text-on-surface-variant font-body">This Year</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded-full bg-secondary"></div>
            <span className="text-label-sm text-on-surface-variant font-body">Last Year</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00daf3" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00daf3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cdbdff" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#cdbdff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(68, 71, 76, 0.15)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00daf3"
            strokeWidth={2.5}
            fill="url(#gradientPrimary)"
            name="Revenue"
            dot={false}
            activeDot={{ r: 5, fill: '#00daf3', stroke: '#0a151a', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="lastYear"
            stroke="#cdbdff"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            fill="url(#gradientSecondary)"
            name="Last Year"
            dot={false}
            activeDot={{ r: 4, fill: '#cdbdff', stroke: '#0a151a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
