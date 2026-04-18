import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts'
import { sendQuery } from '../services/api'
import { useData } from '../context/DataContext'

const CHART_COLORS = ['#00daf3', '#cdbdff', '#00e1ae', '#0090a1', '#5203d5', '#ffb4ab']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3">
        <p className="text-label-md text-on-surface font-body mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-body-sm font-body" style={{ color: entry.color }}>
            {entry.name || entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ExplorationPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [queryHistory, setQueryHistory] = useState([])

  const { datasets, activeDatasetId, suggestions, refreshDatasets, selectDataset } = useData()

  const location = useLocation()

  // Auto-refresh datasets when this page mounts
  useEffect(() => {
    refreshDatasets()
  }, [refreshDatasets])

  const handleQuery = useCallback(async (q) => {
    const queryText = q || query
    if (!queryText.trim()) return
    if (!activeDatasetId) {
      setError('No dataset loaded. Upload a CSV file first from the Data Sources page.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await sendQuery(queryText, activeDatasetId)
      setResult(res)
      setQueryHistory(prev => [{
        query: queryText,
        time: new Date().toLocaleTimeString(),
        success: true
      }, ...prev.slice(0, 9)])
      setQuery('')
    } catch (err) {
      setError(err.message)
      setQueryHistory(prev => [{
        query: queryText,
        time: new Date().toLocaleTimeString(),
        success: false
      }, ...prev.slice(0, 9)])
    } finally {
      setIsLoading(false)
    }
  }, [query, activeDatasetId])

  useEffect(() => {
    if (location.state?.query && activeDatasetId) {
      setQuery(location.state.query)
      handleQuery(location.state.query)
      window.history.replaceState({}, document.title)
    }
  }, [location.state, activeDatasetId, handleQuery])


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleQuery()
    }
  }

  const handleExportCSV = () => {
    if (!result?.result?.data || !Array.isArray(result.result.data) || result.result.data.length === 0) return
    const data = result.result.data
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h] ?? ''
        const strVal = String(val)
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`
        }
        return strVal
      }).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${(result.title || 'data_export').replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderChart = () => {
    if (!result || !result.result) return null
    const { result: queryResult, chartType } = result
    const data = Array.isArray(queryResult.data) ? queryResult.data : []
    if (data.length === 0) return null

    const keys = Object.keys(data[0])
    const labelKey = keys.find(k => typeof data[0][k] === 'string') || keys[0]
    const valueKeys = keys.filter(k => typeof data[0][k] === 'number' && k !== 'count')

    if (chartType === 'line' || queryResult.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00daf3" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00daf3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,71,76,0.15)" vertical={false} />
            <XAxis dataKey={labelKey} axisLine={false} tickLine={false} tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }} />
            <Tooltip content={<CustomTooltip />} />
            {valueKeys.map((vk, i) => (
              <Area key={vk} type="monotone" dataKey={vk} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} fill={i === 0 ? "url(#queryGrad)" : "none"} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,71,76,0.12)" vertical={false} />
          <XAxis dataKey={labelKey} axisLine={false} tickLine={false} tick={{ fill: '#c4c6cc', fontSize: 12, fontFamily: 'Inter' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8e9196', fontSize: 12, fontFamily: 'Inter' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43,54,61,0.3)' }} />
          {valueKeys.map((vk, i) => (
            <Bar key={vk} dataKey={vk} radius={[4, 4, 0, 0]} barSize={35}>
              {data.map((_, j) => (
                <Cell key={j} fill={CHART_COLORS[(i + j) % CHART_COLORS.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderStats = () => {
    if (!result?.result?.data) return null
    const stats = result.result.data
    const statItems = [
      { label: 'Count', value: stats.count },
      { label: 'Sum', value: stats.sum?.toLocaleString() },
      { label: 'Mean', value: stats.mean?.toLocaleString() },
      { label: 'Median', value: stats.median?.toLocaleString() },
      { label: 'Min', value: stats.min?.toLocaleString() },
      { label: 'Max', value: stats.max?.toLocaleString() },
      { label: 'Std Dev', value: stats.stdDev?.toLocaleString() },
      { label: 'Range', value: stats.range?.toLocaleString() },
    ].filter(s => s.value != null)

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((s, i) => (
          <div key={i} className="metric-card p-4">
            <p className="text-label-md text-on-surface-variant font-body">{s.label}</p>
            <p className="font-display text-headline-sm text-on-surface mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderTable = () => {
    if (!result?.result?.data || !Array.isArray(result.result.data) || result.result.data.length === 0) return null
    const data = result.result.data
    const headers = Object.keys(data[0])

    return (
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto mt-4">
        <table className="data-table">
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((row, i) => (
              <tr key={i}>
                {headers.map(h => (
                  <td key={h} className={typeof row[h] === 'number' ? 'text-primary font-medium' : 'text-on-surface-variant'}>
                    {typeof row[h] === 'number' ? row[h].toLocaleString() : String(row[h] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6" id="exploration-page">
      {/* Backend Status */}
      {datasets.length === 0 && (
        <div className="p-4 rounded-md bg-surface-container-low border border-outline-variant/20 flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-error">cloud_off</span>
          <div className="flex-1">
            <p className="text-body-sm text-on-surface font-body">No datasets loaded yet.</p>
            <p className="text-label-sm text-on-surface-variant font-body mt-0.5">
              Go to <Link to="/data-sources" className="text-primary underline">Data Sources</Link> and upload a CSV file first.
            </p>
          </div>
          <button onClick={refreshDatasets} className="btn-ghost text-label-sm py-1.5 px-3">Retry</button>
        </div>
      )}

      {/* Dataset Selector */}
      {datasets.length > 0 && (
        <div className="flex items-center gap-3 animate-slide-up flex-wrap">
          <span className="text-label-md text-on-surface-variant font-body">Active Dataset:</span>
          <div className="flex gap-2 flex-wrap">
            {datasets.map(ds => (
              <button
                key={ds.id}
                onClick={() => selectDataset(ds.id)}
                className={`chip ${activeDatasetId === ds.id ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined text-[14px]">table_chart</span>
                {ds.filename} ({ds.rowCount} rows)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query Input */}
      <div className="bg-surface-container-low rounded-md p-8 animate-slide-up">
        <h2 className="font-display text-headline-md text-on-surface mb-2">
          Explore Data
        </h2>
        <p className="text-body-md text-on-surface-variant font-body mb-6">
          Enter your question to query the dataset.
        </p>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-outline">
            auto_awesome
          </span>
          <input
            id="nl-query-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask anything... e.g., "Show top 5 products by revenue"'
            className="w-full pl-12 pr-14 py-4 bg-surface-container-highest rounded-full text-body-lg text-on-surface placeholder:text-outline font-body outline-none border border-transparent focus:border-primary/30 focus:shadow-glow-primary transition-all"
            disabled={isLoading}
          />
          <button
            id="query-submit-btn"
            onClick={() => handleQuery()}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[20px] text-primary-container">send</span>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-md bg-error/10 border border-error/20 text-error text-body-sm font-body">
            <span className="material-symbols-outlined text-[16px] mr-1 align-middle">error</span>
            {error}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-4">
          {/* Query History */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up">
            <h3 className="font-display text-title-lg text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[18px] text-outline">history</span>
              Query History
            </h3>
            {queryHistory.length === 0 ? (
              <p className="text-body-sm text-outline font-body text-center py-4">No queries yet</p>
            ) : (
              <div className="space-y-2">
                {queryHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(q.query); handleQuery(q.query) }}
                    className="w-full text-left p-3 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[14px] ${q.success ? 'text-tertiary' : 'text-error'}`}>
                        {q.success ? 'check_circle' : 'error'}
                      </span>
                      <p className="text-body-sm text-on-surface font-body group-hover:text-primary transition-colors truncate flex-1">{q.query}</p>
                    </div>
                    <p className="text-label-sm text-outline font-body mt-1 ml-5">{q.time}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up">
            <h3 className="font-display text-title-lg text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[18px] text-secondary">insights</span>
              Suggestions
            </h3>
            <div className="space-y-2">
              {(suggestions.length > 0 ? suggestions : [
                'Show data summary',
                'Top 5 items by value',
                'Show trend over time'
              ]).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(s); handleQuery(s) }}
                  className="w-full text-left p-3 rounded-md bg-surface-container hover:bg-secondary/8 border border-transparent hover:border-secondary/15 transition-all group"
                >
                  <p className="text-body-sm text-on-surface-variant font-body group-hover:text-secondary transition-colors">{s}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {result.insight && (
                <div className="ai-insight-card p-4 flex items-start gap-3 animate-slide-up">
                  <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">auto_awesome</span>
                  <div>
                    <p className="text-body-sm text-secondary/90 font-body">{result.insight}</p>
                    {result.source && (
                      <p className="text-label-sm text-outline font-body mt-1">
                        Source: {result.source === 'gemini' ? 'Gemini' : 'Rule-based Engine'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="query-result">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-headline-sm text-on-surface">{result.title || 'Results'}</h3>
                    <p className="text-body-sm text-on-surface-variant font-body mt-1">
                      Query: &ldquo;{result.userQuery}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.result?.data && Array.isArray(result.result.data) && (
                      <button onClick={handleExportCSV} className="chip text-label-sm py-1.5 px-3 hover:text-primary transition-colors bg-surface-container-high" title="Export as CSV">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Export
                      </button>
                    )}
                    {result.structuredQuery && (
                      <span className="chip text-label-sm py-1 px-3">
                        {result.structuredQuery.operation}
                      </span>
                    )}
                  </div>
                </div>

                {result.result?.type === 'stats' && renderStats()}
                {(result.result?.type === 'chart' || result.result?.type === 'table') && (
                  <>
                    {result.result?.type === 'chart' && renderChart()}
                    {renderTable()}
                  </>
                )}
                {result.result?.type === 'summary' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="metric-card p-4">
                        <p className="text-label-md text-on-surface-variant font-body">Rows</p>
                        <p className="font-display text-headline-sm text-on-surface">{result.result.data.rowCount?.toLocaleString()}</p>
                      </div>
                      <div className="metric-card p-4">
                        <p className="text-label-md text-on-surface-variant font-body">Columns</p>
                        <p className="font-display text-headline-sm text-on-surface">{result.result.data.columnCount}</p>
                      </div>
                    </div>
                    {result.result.data.numericSummaries?.map((s, i) => (
                      <div key={i} className="p-3 bg-surface-container rounded-md">
                        <p className="text-title-md text-primary font-display mb-2">{s.column}</p>
                        <div className="grid grid-cols-4 gap-2 text-body-sm font-body">
                          <div><span className="text-on-surface-variant">Mean:</span> <span className="text-on-surface">{s.mean?.toLocaleString()}</span></div>
                          <div><span className="text-on-surface-variant">Min:</span> <span className="text-on-surface">{s.min?.toLocaleString()}</span></div>
                          <div><span className="text-on-surface-variant">Max:</span> <span className="text-on-surface">{s.max?.toLocaleString()}</span></div>
                          <div><span className="text-on-surface-variant">Std:</span> <span className="text-on-surface">{s.stdDev?.toLocaleString()}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!result && !isLoading && (
            <div className="bg-surface-container-low rounded-md p-12 text-center animate-fade-in">
              <span className="material-symbols-outlined text-[64px] text-outline/30 mb-4 block">query_stats</span>
              <h3 className="font-display text-headline-sm text-on-surface mb-2">Ready to Explore</h3>
              <p className="text-body-md text-on-surface-variant font-body max-w-md mx-auto">
                {datasets.length > 0
                  ? 'Ask a question in natural language about your data.'
                  : 'Upload a CSV file from Data Sources, then ask questions here.'
                }
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-surface-container-low rounded-md p-12 text-center animate-fade-in">
              <div className="w-12 h-12 mx-auto mb-4 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <h3 className="font-display text-headline-sm text-on-surface mb-2">Analyzing...</h3>
              <p className="text-body-md text-on-surface-variant font-body">Processing your query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
