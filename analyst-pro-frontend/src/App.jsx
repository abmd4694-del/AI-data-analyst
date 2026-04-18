import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import ExplorationPage from './pages/ExplorationPage'
import DataUploadPage from './pages/DataUploadPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="exploration" element={<ExplorationPage />} />
            <Route path="data-sources" element={<DataUploadPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
