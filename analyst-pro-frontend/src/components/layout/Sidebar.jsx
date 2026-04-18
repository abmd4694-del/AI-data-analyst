import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/exploration', icon: 'explore', label: 'Exploration' },
  { path: '/data-sources', icon: 'database', label: 'Data Sources' },
  { path: '/reports', icon: 'description', label: 'Reports' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside
      id="sidebar-nav"
      className="fixed left-0 top-0 bottom-0 w-[240px] bg-surface-container-low flex flex-col z-40"
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-5 py-6 no-underline hover:opacity-90 transition-opacity">
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] text-primary-container font-bold">
            monitoring
          </span>
        </div>
        <div>
          <h1 className="font-display text-title-md text-on-surface tracking-tight">
            Data Dashboard
          </h1>
        </div>
      </NavLink>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-3 space-y-1">
        {/* Support — opens mailto instead of broken route */}
        <a
          href="mailto:support@analystpro.io"
          id="nav-support"
          className="nav-item no-underline"
          title="Contact Support"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-body">Support</span>
        </a>

        {/* User Profile */}
        <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-md bg-surface-container">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-label-md text-primary-container font-bold">
            AR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-md text-on-surface truncate">Admin</p>
          </div>
          <NavLink to="/settings" className="p-1 rounded-md hover:bg-surface-container-highest transition-colors" title="Account Settings">
            <span className="material-symbols-outlined text-[18px] text-outline hover:text-primary transition-colors">
              more_horiz
            </span>
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
