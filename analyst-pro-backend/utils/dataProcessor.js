/**
 * DataProcessor — Core data analysis utilities
 * Handles CSV parsing, filtering, grouping, aggregation, and metric calculation.
 */

import Papa from 'papaparse'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class DataProcessor {
  constructor() {
    this.datasets = new Map() // datasetId -> { filename, headers, rows, meta }
    this.metaPath = join(__dirname, '..', 'uploads', 'meta.json')
    this.loadPersistence()
  }

  loadPersistence() {
    try {
      if (fs.existsSync(this.metaPath)) {
        const metadata = JSON.parse(fs.readFileSync(this.metaPath, 'utf-8'))
        for (const [id, file] of Object.entries(metadata)) {
          const filePath = join(__dirname, '..', 'uploads', file)
          if (fs.existsSync(filePath)) {
            this.parseCSV(filePath, id).catch(err => console.error(`Failed to reload ${file}:`, err))
          }
        }
      }
    } catch (e) {
      console.error('Persistence load error', e)
    }
  }

  savePersistence() {
    try {
      const metadata = {}
      for (const [id, ds] of this.datasets.entries()) {
        const fileUploadName = ds.filename || 'unknown.csv'
        metadata[id] = fileUploadName
      }
      const uploadsDir = join(__dirname, '..', 'uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      fs.writeFileSync(this.metaPath, JSON.stringify(metadata, null, 2))
    } catch (e) {
      console.error('Persistence save error', e)
    }
  }

  /**
   * Parse a CSV file and store it in memory
   */
  parseCSV(filePath, datasetId) {
    return new Promise((resolve, reject) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8')

      Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const dataset = {
            id: datasetId,
            filename: filePath.split(/[/\\]/).pop(),
            headers: results.meta.fields || [],
            rows: results.data,
            rowCount: results.data.length,
            columnCount: (results.meta.fields || []).length,
            columnTypes: this.detectColumnTypes(results.data, results.meta.fields || []),
            parsedAt: new Date().toISOString(),
            errors: results.errors.length
          }

          this.datasets.set(datasetId, dataset)
          this.savePersistence()

          resolve({
            id: datasetId,
            filename: dataset.filename,
            headers: dataset.headers,
            rowCount: dataset.rowCount,
            columnCount: dataset.columnCount,
            columnTypes: dataset.columnTypes,
            preview: results.data.slice(0, 10),
            errors: results.errors.slice(0, 5)
          })
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`))
        }
      })
    })
  }

  /**
   * Detect column data types
   */
  detectColumnTypes(rows, headers) {
    const types = {}
    for (const header of headers) {
      const sample = rows.slice(0, 100).map(r => r[header]).filter(v => v != null && v !== '')

      if (sample.length === 0) {
        types[header] = 'unknown'
        continue
      }

      const allNumbers = sample.every(v => typeof v === 'number' || !isNaN(Number(v)))
      if (allNumbers) {
        const hasDecimals = sample.some(v => String(v).includes('.'))
        types[header] = hasDecimals ? 'float' : 'integer'
        continue
      }

      const datePatterns = [/^\d{4}-\d{2}-\d{2}/, /^\d{2}\/\d{2}\/\d{4}/, /^\d{2}-\d{2}-\d{4}/]
      const allDates = sample.every(v => datePatterns.some(p => p.test(String(v))))
      if (allDates) {
        types[header] = 'date'
        continue
      }

      types[header] = 'string'
    }
    return types
  }

  /**
   * Get dataset by ID
   */
  getDataset(datasetId) {
    return this.datasets.get(datasetId) || null
  }

  /**
   * List all loaded datasets
   */
  listDatasets() {
    return Array.from(this.datasets.values()).map(d => ({
      id: d.id,
      filename: d.filename,
      rowCount: d.rowCount,
      columnCount: d.columnCount,
      headers: d.headers,
      columnTypes: d.columnTypes,
      parsedAt: d.parsedAt
    }))
  }

  /**
   * Filter rows by condition
   */
  filterData(datasetId, column, operator, value) {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) throw new Error(`Dataset ${datasetId} not found`)

    const ops = {
      'eq': (a, b) => a === b,
      'neq': (a, b) => a !== b,
      'gt': (a, b) => Number(a) > Number(b),
      'gte': (a, b) => Number(a) >= Number(b),
      'lt': (a, b) => Number(a) < Number(b),
      'lte': (a, b) => Number(a) <= Number(b),
      'contains': (a, b) => String(a).toLowerCase().includes(String(b).toLowerCase()),
      'startsWith': (a, b) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
    }

    const opFn = ops[operator]
    if (!opFn) throw new Error(`Invalid operator: ${operator}`)

    return dataset.rows.filter(row => opFn(row[column], value))
  }

  /**
   * Group data by a column and aggregate
   */
  groupBy(datasetId, groupColumn, metricColumn, aggregation = 'sum') {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) throw new Error(`Dataset ${datasetId} not found`)

    const groups = {}
    for (const row of dataset.rows) {
      const key = String(row[groupColumn] ?? 'Unknown')
      if (!groups[key]) groups[key] = []
      groups[key].push(row[metricColumn])
    }

    const aggs = {
      'sum': (arr) => arr.reduce((s, v) => s + (Number(v) || 0), 0),
      'avg': (arr) => arr.reduce((s, v) => s + (Number(v) || 0), 0) / arr.length,
      'count': (arr) => arr.length,
      'min': (arr) => Math.min(...arr.map(Number).filter(n => !isNaN(n))),
      'max': (arr) => Math.max(...arr.map(Number).filter(n => !isNaN(n))),
    }

    const aggFn = aggs[aggregation]
    if (!aggFn) throw new Error(`Invalid aggregation: ${aggregation}`)

    return Object.entries(groups).map(([key, values]) => ({
      [groupColumn]: key,
      [metricColumn]: Math.round(aggFn(values) * 100) / 100,
      count: values.length
    })).sort((a, b) => b[metricColumn] - a[metricColumn])
  }

  /**
   * Get top N rows by a metric
   */
  topN(datasetId, column, n = 5, order = 'desc') {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) throw new Error(`Dataset ${datasetId} not found`)

    const sorted = [...dataset.rows].sort((a, b) => {
      const aVal = Number(a[column]) || 0
      const bVal = Number(b[column]) || 0
      return order === 'desc' ? bVal - aVal : aVal - bVal
    })

    return sorted.slice(0, n)
  }

  /**
   * Calculate summary statistics for a numeric column
   */
  columnStats(datasetId, column) {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) throw new Error(`Dataset ${datasetId} not found`)

    const values = dataset.rows.map(r => Number(r[column])).filter(v => !isNaN(v))

    if (values.length === 0) {
      return { column, count: 0, message: 'No numeric values found' }
    }

    values.sort((a, b) => a - b)
    const sum = values.reduce((s, v) => s + v, 0)
    const mean = sum / values.length
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)]
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
    const stdDev = Math.sqrt(variance)

    return {
      column,
      count: values.length,
      sum: Math.round(sum * 100) / 100,
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      min: values[0],
      max: values[values.length - 1],
      stdDev: Math.round(stdDev * 100) / 100,
      range: Math.round((values[values.length - 1] - values[0]) * 100) / 100
    }
  }

  /**
   * Get trend data for time series analysis
   */
  trendAnalysis(datasetId, dateColumn, metricColumn, aggregation = 'sum') {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) throw new Error(`Dataset ${datasetId} not found`)

    const grouped = this.groupBy(datasetId, dateColumn, metricColumn, aggregation)

    // Sort by date
    grouped.sort((a, b) => {
      const dateA = new Date(a[dateColumn])
      const dateB = new Date(b[dateColumn])
      return dateA - dateB
    })

    // Calculate trend direction
    if (grouped.length >= 2) {
      const firstHalf = grouped.slice(0, Math.floor(grouped.length / 2))
      const secondHalf = grouped.slice(Math.floor(grouped.length / 2))

      const firstAvg = firstHalf.reduce((s, d) => s + d[metricColumn], 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((s, d) => s + d[metricColumn], 0) / secondHalf.length

      const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100

      return {
        data: grouped,
        trend: changePercent > 0 ? 'increasing' : changePercent < 0 ? 'decreasing' : 'stable',
        changePercent: Math.round(changePercent * 10) / 10,
        dataPoints: grouped.length
      }
    }

    return { data: grouped, trend: 'insufficient_data', dataPoints: grouped.length }
  }

  /**
   * Execute a structured query from the AI
   */
  executeQuery(datasetId, query) {
    const { operation, column, metric, limit, groupBy: groupCol, filter, aggregation, dateColumn } = query

    switch (operation) {
      case 'top':
        return {
          type: 'table',
          data: this.topN(datasetId, metric || column, limit || 5),
          title: `Top ${limit || 5} by ${metric || column}`
        }

      case 'group':
        return {
          type: 'chart',
          chartType: 'bar',
          data: this.groupBy(datasetId, groupCol || column, metric, aggregation || 'sum'),
          title: `${metric} by ${groupCol || column}`
        }

      case 'trend':
        return {
          type: 'chart',
          chartType: 'line',
          ...this.trendAnalysis(datasetId, dateColumn || column, metric, aggregation || 'sum'),
          title: `${metric} trend over ${dateColumn || column}`
        }

      case 'stats':
        return {
          type: 'stats',
          data: this.columnStats(datasetId, column || metric),
          title: `Statistics for ${column || metric}`
        }

      case 'filter':
        return {
          type: 'table',
          data: this.filterData(datasetId, column, filter?.operator || 'eq', filter?.value),
          title: `Filtered ${column} ${filter?.operator} ${filter?.value}`
        }

      case 'summary':
        const dataset = this.getDataset(datasetId)
        if (!dataset) throw new Error(`Dataset not found`)
        const numericCols = Object.entries(dataset.columnTypes)
          .filter(([, type]) => type === 'integer' || type === 'float')
          .map(([col]) => col)

        const summaries = numericCols.slice(0, 5).map(col => this.columnStats(datasetId, col))
        return {
          type: 'summary',
          data: {
            rowCount: dataset.rowCount,
            columnCount: dataset.columnCount,
            columns: dataset.headers,
            columnTypes: dataset.columnTypes,
            numericSummaries: summaries
          },
          title: `Summary of ${dataset.filename}`
        }

      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }
}

// Singleton instance
const dataProcessor = new DataProcessor()
export default dataProcessor
