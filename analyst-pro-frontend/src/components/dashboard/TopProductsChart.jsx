import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { name: 'Neural Processor X1', revenue: 420000, color: '#00daf3' },
  { name: 'Quantum Drive Pro', revenue: 380000, color: '#00c4db' },
  { name: 'HoloLens Array', revenue: 310000, color: '#00adc4' },
  { name: 'Fusion Battery V3', revenue: 280000, color: '#0097ac' },
  { name: 'SynthCore Module', revenue: 220000, color: '#008095' },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3">
        <p className="text-label-md text-on-surface font-body mb-1">{payload[0].payload.name}</p>
        <p className="text-body-sm text-primary font-body">
          ${(payload[0].value / 1000).toFixed(0)}k
        </p>
      </div>
    )
  }
  return null
}

export default function TopProductsChart() {
  const [filter, setFilter] = useState('Q3-Q4')

  const handleFilter = () => {
    setFilter(prev => prev === 'Q3-Q4' ? 'YTD' : 'Q3-Q4')
  }

  return (
    <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="top-products-chart">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-headline-sm text-on-surface">Top Products by Revenue</h3>
        </div>
        <button onClick={handleFilter} className="chip">
          <span className="material-symbols-outlined text-[16px]">filter_list</span>
          {filter}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 20, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(68, 71, 76, 0.1)"
            horizontal={false}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#c4c6cc', fontSize: 12, fontFamily: 'Inter' }}
            width={130}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43, 54, 61, 0.3)' }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
