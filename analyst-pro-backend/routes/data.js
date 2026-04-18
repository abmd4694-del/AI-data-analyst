import { Router } from 'express'
import dataProcessor from '../utils/dataProcessor.js'

const router = Router()

/**
 * POST /api/data/filter
 * Filter dataset rows
 */
router.post('/filter', (req, res, next) => {
  try {
    const { datasetId, column, operator, value } = req.body

    if (!datasetId || !column || !operator) {
      return res.status(400).json({ error: true, message: 'datasetId, column, and operator are required' })
    }

    const result = dataProcessor.filterData(datasetId, column, operator, value)
    res.json({ success: true, data: result, count: result.length })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/data/group
 * Group and aggregate data
 */
router.post('/group', (req, res, next) => {
  try {
    const { datasetId, groupBy, metric, aggregation } = req.body

    if (!datasetId || !groupBy || !metric) {
      return res.status(400).json({ error: true, message: 'datasetId, groupBy, and metric are required' })
    }

    const result = dataProcessor.groupBy(datasetId, groupBy, metric, aggregation || 'sum')
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/data/top
 * Get top N rows by a metric
 */
router.post('/top', (req, res, next) => {
  try {
    const { datasetId, column, limit, order } = req.body

    if (!datasetId || !column) {
      return res.status(400).json({ error: true, message: 'datasetId and column are required' })
    }

    const result = dataProcessor.topN(datasetId, column, limit || 5, order || 'desc')
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/data/stats
 * Get column statistics
 */
router.post('/stats', (req, res, next) => {
  try {
    const { datasetId, column } = req.body

    if (!datasetId || !column) {
      return res.status(400).json({ error: true, message: 'datasetId and column are required' })
    }

    const result = dataProcessor.columnStats(datasetId, column)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/data/trend
 * Trend analysis
 */
router.post('/trend', (req, res, next) => {
  try {
    const { datasetId, dateColumn, metric, aggregation } = req.body

    if (!datasetId || !dateColumn || !metric) {
      return res.status(400).json({ error: true, message: 'datasetId, dateColumn, and metric are required' })
    }

    const result = dataProcessor.trendAnalysis(datasetId, dateColumn, metric, aggregation || 'sum')
    res.json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
})

export default router
