import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
