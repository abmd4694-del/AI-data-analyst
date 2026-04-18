import { Router } from 'express'
import multer from 'multer'
import { randomUUID } from 'crypto'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dataProcessor from '../utils/dataProcessor.js'
import fs from 'fs'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Configure multer for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}-${file.originalname}`
    cb(null, uniqueName)
  }
})

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/octet-stream'
  ]
  if (allowed.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls)$/i)) {
    cb(null, true)
  } else {
    cb(new Error('Only CSV and Excel files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 50) * 1024 * 1024
  }
})

/**
 * POST /api/upload
 * Upload a CSV file and parse it
 */
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' })
    }

    const datasetId = randomUUID()
    const result = await dataProcessor.parseCSV(req.file.path, datasetId)

    res.json({
      success: true,
      message: `File "${req.file.originalname}" uploaded and parsed successfully`,
      dataset: result
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/upload/datasets
 * List all loaded datasets
 */
router.get('/datasets', (req, res) => {
  const datasets = dataProcessor.listDatasets()
  res.json({ success: true, datasets })
})

/**
 * GET /api/upload/datasets/:id
 * Get dataset details
 */
router.get('/datasets/:id', (req, res) => {
  const dataset = dataProcessor.getDataset(req.params.id)
  if (!dataset) {
    return res.status(404).json({ error: true, message: 'Dataset not found' })
  }
  res.json({
    success: true,
    dataset: {
      id: dataset.id,
      filename: dataset.filename,
      headers: dataset.headers,
      rowCount: dataset.rowCount,
      columnCount: dataset.columnCount,
      columnTypes: dataset.columnTypes,
      preview: dataset.rows.slice(0, 20)
    }
  })
})

/**
 * GET /api/upload/datasets/:id/preview
 * Get first N rows of a dataset
 */
router.get('/datasets/:id/preview', (req, res) => {
  const dataset = dataProcessor.getDataset(req.params.id)
  if (!dataset) {
    return res.status(404).json({ error: true, message: 'Dataset not found' })
  }

  const limit = Math.min(parseInt(req.query.limit) || 50, 500)
  res.json({
    success: true,
    data: dataset.rows.slice(0, limit),
    headers: dataset.headers,
    total: dataset.rowCount
  })
})

export default router
