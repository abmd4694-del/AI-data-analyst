import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from '../services/api'
import { useData } from '../context/DataContext'

export default function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()
  const { refreshDatasets, datasets } = useData()

  const handleUpload = useCallback(async (files) => {
    setIsUploading(true)
    setError(null)

    for (const file of files) {
      const fileEntry = {
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      }
      setUploadedFiles(prev => [...prev, fileEntry])

      try {
        const result = await uploadFile(file)
        setUploadedFiles(prev =>
          prev.map(f => f.name === file.name
            ? { ...f, status: 'complete', dataset: result.dataset }
            : f
          )
        )
        // Refresh shared dataset state — this auto-selects the latest upload
        await refreshDatasets()
      } catch (err) {
        setUploadedFiles(prev =>
          prev.map(f => f.name === file.name
            ? { ...f, status: 'error', error: err.message }
            : f
          )
        )
        setError(err.message)
      }
    }
    setIsUploading(false)
  }, [refreshDatasets])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleUpload(files)
  }, [handleUpload])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) handleUpload(files)
  }, [handleUpload])

  return (
    <div className="space-y-6" id="data-upload-page">
      {/* Upload Zone */}
      <div className="bg-surface-container-low rounded-md p-8 animate-slide-up">
        <h2 className="font-display text-headline-md text-on-surface mb-2">Import your intelligence</h2>
        <p className="text-body-md text-on-surface-variant font-body mb-6">
          Drag and drop your CSV or Excel files here to begin curated analysis. AI will automatically structure your metrics.
        </p>

        <div
          className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          id="csv-drop-zone"
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload-input"
          />
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
            </div>
            <p className="text-title-md text-on-surface font-display mb-2">
              {isUploading ? 'Uploading...' : 'Drop your files here'}
            </p>
            <p className="text-body-sm text-on-surface-variant font-body mb-4">
              Supports CSV, XLS, and XLSX formats up to 50MB
            </p>
            <label
              htmlFor="file-upload-input"
              className="btn-primary cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              Browse Files
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-error/10 border border-error/20 text-error text-body-sm font-body">
            <span className="material-symbols-outlined text-[16px] mr-2 align-middle">error</span>
            {error}
          </div>
        )}

        {/* Uploaded files status */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-container rounded-md animate-slide-up">
                <span className={`material-symbols-outlined text-[20px] ${
                  file.status === 'complete' ? 'text-tertiary' :
                  file.status === 'error' ? 'text-error' : 'text-primary'
                }`}>
                  {file.status === 'complete' ? 'check_circle' :
                   file.status === 'error' ? 'error' : 'description'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-on-surface font-body truncate">{file.name}</p>
                  {file.dataset && (
                    <p className="text-label-sm text-on-surface-variant font-body">
                      {file.dataset.rowCount} rows • {file.dataset.columnCount} columns
                    </p>
                  )}
                  {file.error && (
                    <p className="text-label-sm text-error font-body">{file.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-label-sm text-primary font-body">Processing...</span>
                    </div>
                  )}
                  {file.status === 'complete' && (
                    <span className="text-label-sm text-tertiary font-body">✓ Ready</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parsed Dataset Preview */}
      {uploadedFiles.filter(f => f.status === 'complete').map((file, i) => (
        <div key={i} className="bg-surface-container-low rounded-md p-6 animate-slide-up" id={`dataset-preview-${i}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-headline-sm text-on-surface">{file.name}</h3>
              <p className="text-body-sm text-on-surface-variant font-body mt-1">
                {file.dataset.rowCount} rows • {file.dataset.columnCount} columns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              <span className="text-label-sm text-tertiary font-body">Parsed</span>
            </div>
          </div>

          {/* Column Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {file.dataset.headers.map((header, j) => (
              <span key={j} className="chip text-label-sm py-1 px-3">
                {header}
                <span className="text-outline ml-1 text-[10px]">
                  {file.dataset.columnTypes[header]}
                </span>
              </span>
            ))}
          </div>

          {/* Preview Table */}
          {file.dataset.preview && file.dataset.preview.length > 0 && (
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    {file.dataset.headers.map((h, j) => (
                      <th key={j}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {file.dataset.preview.slice(0, 10).map((row, j) => (
                    <tr key={j}>
                      {file.dataset.headers.map((h, k) => (
                        <td key={k} className="text-on-surface-variant">{String(row[h] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* All loaded datasets from backend */}
      <div className="bg-surface-container-low rounded-md p-6 animate-slide-up" id="recent-sources">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-headline-sm text-on-surface">Loaded Datasets</h3>
            <p className="text-body-sm text-on-surface-variant font-body mt-1">
              {datasets.length > 0
                ? `${datasets.length} dataset${datasets.length > 1 ? 's' : ''} in memory`
                : 'Upload a CSV file to get started'
              }
            </p>
          </div>
        </div>

        {datasets.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-[48px] text-outline/40 mb-3 block">table_chart</span>
            <p className="text-body-md text-on-surface-variant font-body">No datasets loaded yet</p>
            <p className="text-body-sm text-outline font-body mt-1">Upload a CSV file above to begin analysis</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {datasets.map((ds) => (
              <div key={ds.id} className="flex items-center gap-3 p-3 bg-surface-container rounded-md">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">table_chart</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-on-surface font-body truncate">{ds.filename}</p>
                  <p className="text-label-sm text-on-surface-variant font-body">
                    {ds.rowCount} rows • {ds.columnCount} cols
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="text-label-sm text-tertiary font-body">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendation */}
      <div className="ai-insight-card p-5 animate-slide-up" id="ai-recommendation">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] text-secondary">psychology</span>
          </div>
          <div className="flex-1">
            <h4 className="text-title-md text-secondary font-display mb-1">AI Recommendation</h4>
            <p className="text-body-md text-on-surface-variant font-body">
              {uploadedFiles.some(f => f.status === 'complete')
                ? 'Your data is ready! Head to the Exploration page to start asking questions in natural language.'
                : 'Upload a CSV file to unlock AI-powered analysis. The Curator will automatically detect patterns and suggest insights.'
              }
            </p>
          </div>
          {uploadedFiles.some(f => f.status === 'complete') && (
            <button
              onClick={() => navigate('/exploration')}
              className="btn-primary text-label-md py-2 px-4 shrink-0"
            >
              Start Exploring →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
