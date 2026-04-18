import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/exploration': 'Exploration',
  '/data-sources': 'Data Sources',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

const notifications = [
  { text: 'New dataset uploaded successfully', time: '2m ago', icon: 'check_circle', color: 'text-tertiary' },
  { text: 'Weekly report generated', time: '1h ago', icon: 'description', color: 'text-primary' }
]

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] || 'Dashboard'

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [readNotifs, setReadNotifs] = useState([])

  const notifRef = useRef(null)
  const userRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/exploration`, { state: { query: searchQuery } })
      setSearchQuery('')
    }
  }

  const markAllRead = () => {
    setReadNotifs(notifications.map((_, i) => i))
  }

  const unreadCount = notifications.length - readNotifs.length

  return (
    <header
      id="topbar"
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-surface/80 backdrop-blur-lg border-b border-ghost"
      style={{ borderColor: 'rgba(68, 71, 76, 0.12)' }}
    >
      {/* Page Title */}
      <div>
        <h2 className="font-display text-headline-sm text-on-surface">{title}</h2>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
            search
          </span>
          <input
            id="global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search insights, data, reports..."
            className="w-[320px] pl-10 pr-4 py-2 bg-surface-container-highest rounded-full text-body-sm text-on-surface placeholder:text-outline font-body outline-none border border-transparent focus:border-primary/30 transition-colors"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
            className="relative p-2 rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[9px] text-primary-container font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-low rounded-md shadow-elevation-3 border border-outline-variant/10 overflow-hidden animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
                <h4 className="text-title-md text-on-surface font-display">Notifications</h4>
                <button onClick={markAllRead} className="text-label-sm text-primary font-body hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => { setReadNotifs(prev => [...prev, i]); setShowNotifications(false) }}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-surface-container transition-colors ${readNotifs.includes(i) ? 'opacity-50' : ''}`}
                  >
                    <span className={`material-symbols-outlined text-[18px] mt-0.5 ${n.color}`}>{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-on-surface font-body">{n.text}</p>
                      <p className="text-label-sm text-outline font-body mt-0.5">{n.time}</p>
                    </div>
                    {!readNotifs.includes(i) && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative" ref={userRef}>
          <button
            id="user-menu-btn"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
            className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-label-md text-primary-container font-bold hover:opacity-90 transition-opacity"
          >
            AR
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-surface-container-low rounded-md shadow-elevation-3 border border-outline-variant/10 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <p className="text-title-md text-on-surface font-display">Admin</p>
                <p className="text-label-sm text-on-surface-variant font-body">admin@example.com</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/settings'); setShowUserMenu(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-on-surface font-body hover:bg-surface-container transition-colors text-left">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">settings</span>
                  Settings
                </button>
                <button onClick={() => { navigate('/reports'); setShowUserMenu(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-on-surface font-body hover:bg-surface-container transition-colors text-left">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">description</span>
                  Reports
                </button>
                <button onClick={() => { navigate('/data-sources'); setShowUserMenu(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-on-surface font-body hover:bg-surface-container transition-colors text-left">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">database</span>
                  Data Sources
                </button>
              </div>
              <div className="py-1 border-t border-outline-variant/10">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-error font-body hover:bg-error/5 transition-colors text-left">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
