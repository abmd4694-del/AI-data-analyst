import { Router } from 'express'
import { processNaturalLanguageQuery, generateInsight } from '../utils/aiEngine.js'
import dataProcessor from '../utils/dataProcessor.js'

const router = Router()

/**
 * POST /api/query
 * Process a natural language query against a dataset
 *
 * Body: { query: string, datasetId: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { query, datasetId } = req.body

    if (!query) {
      return res.status(400).json({ error: true, message: 'Query is required' })
    }

    if (!datasetId) {
      return res.status(400).json({ error: true, message: 'Dataset ID is required. Upload a file first.' })
    }

    const dataset = dataProcessor.getDataset(datasetId)
    if (!dataset) {
      return res.status(404).json({ error: true, message: 'Dataset not found. It may have expired — please re-upload.' })
    }

    // Step 1: Convert natural language to structured query via AI
    const aiResult = await processNaturalLanguageQuery(query, {
      headers: dataset.headers,
      columnTypes: dataset.columnTypes,
      rowCount: dataset.rowCount,
      filename: dataset.filename
    })

    if (!aiResult.success) {
      return res.status(400).json({
        error: true,
        message: 'Could not interpret your query. Try rephrasing.',
        suggestion: 'Try asking something like "Show top 5 products by revenue" or "Monthly sales trend"'
      })
    }

    // Step 2: Execute the structured query on the data
    const queryResult = dataProcessor.executeQuery(datasetId, aiResult.query)

    // Step 3: Generate AI insight about the results
    const insight = await generateInsight(query, queryResult, {
      filename: dataset.filename,
      rowCount: dataset.rowCount
    })

    res.json({
      success: true,
      userQuery: query,
      structuredQuery: aiResult.query,
      source: aiResult.source,
      result: queryResult,
      insight,
      chartType: aiResult.query.chartType || 'bar',
      title: aiResult.query.title || queryResult.title
    })
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: true, message: error.message })
    }
    next(error)
  }
})

/**
 * POST /api/query/structured
 * Execute a pre-structured query directly (no AI processing)
 *
 * Body: { datasetId: string, query: { operation, column, metric, ... } }
 */
router.post('/structured', async (req, res, next) => {
  try {
    const { datasetId, query } = req.body

    if (!datasetId || !query) {
      return res.status(400).json({ error: true, message: 'datasetId and query are required' })
    }

    const dataset = dataProcessor.getDataset(datasetId)
    if (!dataset) {
      return res.status(404).json({ error: true, message: 'Dataset not found' })
    }

    const result = dataProcessor.executeQuery(datasetId, query)

    res.json({
      success: true,
      result,
      title: query.title || result.title
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/query/suggestions
 * Get AI-powered query suggestions based on dataset columns
 */
router.get('/suggestions/:datasetId', (req, res) => {
  const dataset = dataProcessor.getDataset(req.params.datasetId)
  if (!dataset) {
    return res.status(404).json({ error: true, message: 'Dataset not found' })
  }

  const numericCols = Object.entries(dataset.columnTypes)
    .filter(([, t]) => t === 'integer' || t === 'float')
    .map(([col]) => col)

  const stringCols = Object.entries(dataset.columnTypes)
    .filter(([, t]) => t === 'string')
    .map(([col]) => col)

  const dateCols = Object.entries(dataset.columnTypes)
    .filter(([, t]) => t === 'date')
    .map(([col]) => col)

  const suggestions = []

  if (numericCols.length > 0 && stringCols.length > 0) {
    suggestions.push(`Show top 5 ${stringCols[0]} by ${numericCols[0]}`)
    suggestions.push(`Average ${numericCols[0]} per ${stringCols[0]}`)
    suggestions.push(`${numericCols[0]} by ${stringCols[0]}`)
  }

  if (dateCols.length > 0 && numericCols.length > 0) {
    suggestions.push(`Show ${numericCols[0]} trend over time`)
    suggestions.push(`Monthly ${numericCols[0]} trend`)
  }

  if (numericCols.length > 0) {
    suggestions.push(`Statistics for ${numericCols[0]}`)
  }

  suggestions.push('Show data summary')

  res.json({
    success: true,
    suggestions: suggestions.slice(0, 6),
    columns: {
      numeric: numericCols,
      categorical: stringCols,
      date: dateCols
    }
  })
})

export default router
