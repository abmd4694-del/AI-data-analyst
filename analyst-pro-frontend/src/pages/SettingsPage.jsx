import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('sources')
  const [showAddSource, setShowAddSource] = useState(false)
  const [showSchemaAction, setShowSchemaAction] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const [connectedSources, setConnectedSources] = useState([
    { name: 'Snowflake Warehouse', detail: 'prod-data-west-1', lastSync: '2m ago', icon: 'ac_unit', status: 'connected' },
    { name: 'Google Analytics 4', detail: 'analystpro.io', lastSync: '14m ago', icon: 'analytics', status: 'connected' },
    { name: 'PostgreSQL Cluster', detail: 'customer-db-primary', lastSync: '1h ago', icon: 'database', status: 'connected' },
  ])

  const availableSources = [
    { name: 'MySQL Database', icon: 'database', desc: 'Connect to MySQL servers' },
    { name: 'MongoDB Atlas', icon: 'cloud', desc: 'NoSQL document database' },
    { name: 'Amazon S3', icon: 'cloud_upload', desc: 'S3 bucket data import' },
    { name: 'REST API', icon: 'api', desc: 'Custom API endpoint' },
  ]

  const settingsMenu = [
    { icon: 'group', label: 'User Management', description: 'Manage team roles and permissions' },
    { icon: 'security', label: 'API Keys & Tokens', description: 'Generate and manage access credentials' },
    { icon: 'payments', label: 'Usage & Billing', description: 'Monitor resource consumption and costs' },
    { icon: 'shield', label: 'Data Governance', description: 'Configure privacy and compliance policies' },
  ]

  const [settingsState, setSettingsState] = useState({
    'User Management': false,
    'API Keys & Tokens': false,
    'Usage & Billing': false,
    'Data Governance': false,
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRemoveSource = (index) => {
    const removed = connectedSources[index].name
    setConnectedSources(prev => prev.filter((_, i) => i !== index))
    showToast(`${removed} disconnected`)
  }

  const handleAddSource = (source) => {
    setConnectedSources(prev => [...prev, {
      ...source,
      detail: 'newly-connected',
      lastSync: 'just now',
      status: 'connected'
    }])
    setShowAddSource(false)
    showToast(`${source.name} connected successfully`)
  }

  return (
    <div className="space-y-6" id="settings-page">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-surface-container-low rounded-md shadow-elevation-3 border border-tertiary/20 flex items-center gap-3 animate-slide-up">
          <span className="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
          <p className="text-body-sm text-on-surface font-body">{toastMessage}</p>
        </div>
      )}

      {/* Add Data Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-low rounded-lg p-6 w-[450px] shadow-elevation-3 animate-slide-up">
            <h3 className="font-display text-headline-sm text-on-surface mb-2">Add Data Source</h3>
            <p className="text-body-sm text-on-surface-variant font-body mb-5">Select an integration to connect.</p>
            <div className="space-y-2">
              {availableSources.map((source, i) => (
                <button
                  key={i}
                  onClick={() => handleAddSource(source)}
                  className="w-full flex items-center gap-4 p-4 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-primary">{source.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-title-md text-on-surface font-display">{source.name}</p>
                    <p className="text-label-sm text-on-surface-variant font-body">{source.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">add_circle</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddSource(false)} className="btn-ghost w-full mt-4 text-label-md">Cancel</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="font-display text-headline-md text-on-surface mb-2">Sources &amp; Context</h2>
        <p className="text-body-md text-on-surface-variant font-body">
          Manage the pipelines feeding your digital curator. Connected nodes represent the raw intelligence accessible to the AI model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connected Sources */}
          <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="connected-sources">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-headline-sm text-on-surface">Connected Sources</h3>
              <p className="text-body-sm text-on-surface-variant font-body">{connectedSources.length} active integrations</p>
            </div>
            <div className="space-y-3">
              {connectedSources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-surface-container rounded-md hover:bg-surface-container-high transition-colors"
                  id={`connected-source-${i}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px] text-primary">{source.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-title-md text-on-surface font-display">{source.name}</p>
                    <p className="text-label-sm text-on-surface-variant font-body mt-0.5">
                      {source.detail} • Last sync: {source.lastSync}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                      <span className="text-label-sm text-tertiary font-body capitalize">{source.status}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSource(i)}
                      className="p-2 rounded-lg hover:bg-error/10 transition-colors"
                      title="Disconnect source"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error transition-colors">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddSource(true)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Data Source
            </button>
          </div>

          {/* Schema Alert */}
          {showSchemaAction && (
            <div className="ai-insight-card p-5 animate-slide-up" id="schema-alert">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[22px] text-secondary">auto_awesome</span>
                <div className="flex-1">
                  <h4 className="text-title-md text-secondary font-display mb-1">Schema Change Detected</h4>
                  <p className="text-body-md text-on-surface-variant font-body">
                    &ldquo;I&rsquo;ve detected a schema change in Snowflake. Would you like me to re-map the embedding vectors
                    for the &lsquo;Transactions&rsquo; table?&rdquo;
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setShowSchemaAction(false); showToast('Re-mapping embedding vectors…') }} className="btn-primary text-label-md py-2 px-4">Re-map</button>
                  <button onClick={() => setShowSchemaAction(false)} className="btn-ghost text-label-md py-2 px-4">Ignore</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* AI Intelligence Status */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up" id="ai-status">
            <h3 className="font-display text-title-lg text-on-surface mb-4">AI Intelligence Status</h3>
            <p className="text-body-sm text-on-surface-variant font-body mb-4">Global sync across {connectedSources.length * 4} active data streams.</p>
            <div className="p-3 bg-surface-container rounded-md mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-md text-on-surface font-body">Vector Embedding</span>
                <span className="text-label-sm text-tertiary font-body">Active</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full animate-pulse" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-surface-container rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-md text-on-surface font-body">Processing PostgreSQL batch</span>
                <span className="text-label-sm text-primary font-body">Running</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>

          {/* Workspace Settings Menu */}
          <div className="bg-surface-container-low rounded-md p-5 animate-slide-up" id="workspace-settings">
            <h3 className="font-display text-title-lg text-on-surface mb-4">Workspace Settings</h3>
            <div className="space-y-1">
              {settingsMenu.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSettingsState(prev => ({ ...prev, [item.label]: !prev[item.label] }))
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-surface-container transition-colors group text-left"
                  id={`settings-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-title-md text-on-surface font-body">{item.label}</p>
                    {settingsState[item.label] && (
                      <p className="text-label-sm text-on-surface-variant font-body mt-0.5 animate-fade-in">{item.description}</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-outline transition-transform" style={{ transform: settingsState[item.label] ? 'rotate(90deg)' : 'none' }}>
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
