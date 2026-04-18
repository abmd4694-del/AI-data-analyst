import { createContext, useContext, useState, useCallback } from 'react'
import { getDatasets as fetchDatasets, getQuerySuggestions } from '../services/api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([])
  const [activeDatasetId, setActiveDatasetId] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshDatasets = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetchDatasets()
      if (res.success && res.datasets.length > 0) {
        setDatasets(res.datasets)
        // Auto-select the most recently parsed dataset
        const sorted = [...res.datasets].sort(
          (a, b) => new Date(b.parsedAt) - new Date(a.parsedAt)
        )
        const latestId = sorted[0].id
        setActiveDatasetId(latestId)
        // Load suggestions for the latest dataset
        try {
          const sugRes = await getQuerySuggestions(latestId)
          if (sugRes.success) setSuggestions(sugRes.suggestions)
        } catch {
          setSuggestions([])
        }
        setIsLoading(false)
        return true
      }
    } catch {
      // Backend might not be running
    }
    setIsLoading(false)
    return false
  }, [])

  const selectDataset = useCallback(async (datasetId) => {
    setActiveDatasetId(datasetId)
    try {
      const sugRes = await getQuerySuggestions(datasetId)
      if (sugRes.success) setSuggestions(sugRes.suggestions)
    } catch {
      setSuggestions([])
    }
  }, [])

  return (
    <DataContext.Provider value={{
      datasets,
      activeDatasetId,
      suggestions,
      isLoading,
      refreshDatasets,
      selectDataset,
      setActiveDatasetId
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
