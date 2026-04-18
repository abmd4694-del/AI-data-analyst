/**
 * API Service — Frontend client for the Analyst Pro backend
 * Uses Vite proxy (/api -> localhost:3001/api) so no hardcoded URLs needed.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Upload a CSV file
 */
export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }))
    throw new Error(err.message || 'Upload failed')
  }

  return res.json()
}

/**
 * Get all loaded datasets
 */
export async function getDatasets() {
  const res = await fetch(`${API_BASE}/upload/datasets`)
  if (!res.ok) throw new Error('Failed to fetch datasets')
  return res.json()
}

/**
 * Get dataset details
 */
export async function getDataset(datasetId) {
  const res = await fetch(`${API_BASE}/upload/datasets/${datasetId}`)
  return res.json()
}

/**
 * Get dataset preview (first N rows)
 */
export async function getDatasetPreview(datasetId, limit = 50) {
  const res = await fetch(`${API_BASE}/upload/datasets/${datasetId}/preview?limit=${limit}`)
  return res.json()
}

/**
 * Send a natural language query
 */
export async function sendQuery(query, datasetId) {
  const res = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, datasetId })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Query failed' }))
    throw new Error(err.message || 'Query failed')
  }

  return res.json()
}

/**
 * Get query suggestions for a dataset
 */
export async function getQuerySuggestions(datasetId) {
  const res = await fetch(`${API_BASE}/query/suggestions/${datasetId}`)
  return res.json()
}

/**
 * Execute a structured query directly
 */
export async function executeStructuredQuery(datasetId, query) {
  const res = await fetch(`${API_BASE}/query/structured`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datasetId, query })
  })

  return res.json()
}

/**
 * Health check
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`)
    return res.json()
  } catch {
    return { status: 'offline' }
  }
}

export default {
  uploadFile,
  getDatasets,
  getDataset,
  getDatasetPreview,
  sendQuery,
  getQuerySuggestions,
  executeStructuredQuery,
  checkHealth
}
