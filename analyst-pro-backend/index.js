import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uploadRoutes from './routes/upload.js'
import queryRoutes from './routes/query.js'
import dataRoutes from './routes/data.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || origin === process.env.FRONTEND_URL) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


// Static uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Routes
app.use('/api/upload', uploadRoutes)
app.use('/api/query', queryRoutes)
app.use('/api/data', dataRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Analyst Pro API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
