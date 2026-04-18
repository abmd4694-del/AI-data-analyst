/**
 * AIEngine — Natural Language to Structured Query converter
 * Uses Google Gemini API to interpret user questions and convert them
 * to structured data operations.
 */

import dotenv from 'dotenv'
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Convert a natural language query to a structured data operation
 */
export async function processNaturalLanguageQuery(userQuery, datasetMeta) {
  const { headers, columnTypes, rowCount, filename } = datasetMeta

  const systemPrompt = `You are a data analyst AI assistant. A user has uploaded a CSV file and is asking a question about their data.

DATASET INFO:
- Filename: ${filename}
- Rows: ${rowCount}
- Columns: ${headers.join(', ')}
- Column Types: ${JSON.stringify(columnTypes)}

USER QUESTION: "${userQuery}"

You MUST respond with valid JSON only. No markdown, no code blocks, no explanation outside JSON.

Respond with a JSON object matching ONE of these operations:

1. Top N items:
{"operation":"top","column":"column_name","metric":"numeric_column","limit":5}

2. Group and aggregate:
{"operation":"group","groupBy":"category_column","metric":"numeric_column","aggregation":"sum|avg|count|min|max"}

3. Trend analysis:
{"operation":"trend","dateColumn":"date_column","metric":"numeric_column","aggregation":"sum"}

4. Statistics:
{"operation":"stats","column":"numeric_column"}

5. Filter:
{"operation":"filter","column":"column_name","filter":{"operator":"eq|gt|lt|gte|lte|contains","value":"filter_value"}}

6. Summary:
{"operation":"summary"}

Also include these fields in your response:
- "chartType": "bar" | "line" | "pie" | "area" (suggested visualization)
- "insight": A brief 1-2 sentence insight about what this query will reveal
- "title": A descriptive title for the result

Choose the operation that best matches the user's question. Use actual column names from the dataset.`

  // If no API key, use rule-based fallback
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return fallbackQueryParser(userQuery, datasetMeta)
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      })
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Gemini API error:', response.status, errorBody)
      return fallbackQueryParser(userQuery, datasetMeta)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Empty Gemini response')
      return fallbackQueryParser(userQuery, datasetMeta)
    }

    const parsed = JSON.parse(text)
    return { success: true, query: parsed, source: 'gemini' }
  } catch (error) {
    console.error('Gemini API error:', error.message)
    return fallbackQueryParser(userQuery, datasetMeta)
  }
}

/**
 * Generate AI insight text about query results
 */
export async function generateInsight(userQuery, queryResult, datasetMeta) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return generateFallbackInsight(queryResult)
  }

  try {
    const prompt = `You are an AI data analyst. The user asked: "${userQuery}"

Here is the result data (truncated to first 10 items):
${JSON.stringify(queryResult.data?.slice?.(0, 10) || queryResult.data, null, 2)}

Dataset: ${datasetMeta.filename} (${datasetMeta.rowCount} rows)

Provide a brief, insightful 2-3 sentence analysis of this data. Mention specific numbers and trends. Be concise and actionable. Return ONLY the insight text, no JSON.`

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 256
        }
      })
    })

    if (!response.ok) {
      return generateFallbackInsight(queryResult)
    }

    const data = await response.json()
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text
    return insight || generateFallbackInsight(queryResult)
  } catch {
    return generateFallbackInsight(queryResult)
  }
}

/**
 * Fallback rule-based query parser when Gemini API is unavailable
 */
function fallbackQueryParser(userQuery, datasetMeta) {
  const query = userQuery.toLowerCase()
  const { headers, columnTypes } = datasetMeta

  const numericColumns = Object.entries(columnTypes)
    .filter(([, type]) => type === 'integer' || type === 'float')
    .map(([col]) => col)

  const stringColumns = Object.entries(columnTypes)
    .filter(([, type]) => type === 'string')
    .map(([col]) => col)

  const dateColumns = Object.entries(columnTypes)
    .filter(([, type]) => type === 'date')
    .map(([col]) => col)

  // Find mentioned columns
  const mentionedNumeric = numericColumns.find(col =>
    query.includes(col.toLowerCase())
  )
  const mentionedString = stringColumns.find(col =>
    query.includes(col.toLowerCase())
  )

  // Pattern matching
  if (query.includes('top') || query.includes('highest') || query.includes('best')) {
    const limitMatch = query.match(/top\s+(\d+)/i)
    const limit = limitMatch ? parseInt(limitMatch[1]) : 5
    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'top',
        column: mentionedString || stringColumns[0] || headers[0],
        metric: mentionedNumeric || numericColumns[0],
        limit,
        chartType: 'bar',
        insight: `Showing the top ${limit} entries.`,
        title: `Top ${limit} by ${mentionedNumeric || numericColumns[0] || 'value'}`
      }
    }
  }

  if (query.includes('trend') || query.includes('over time') || query.includes('monthly') || query.includes('daily')) {
    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'trend',
        dateColumn: dateColumns[0] || mentionedString || stringColumns[0] || headers[0],
        metric: mentionedNumeric || numericColumns[0],
        aggregation: 'sum',
        chartType: 'line',
        insight: 'Analyzing trends over time.',
        title: `${mentionedNumeric || numericColumns[0] || 'Value'} Trend`
      }
    }
  }

  if (query.includes('average') || query.includes('avg') || query.includes('mean')) {
    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'group',
        groupBy: mentionedString || stringColumns[0] || headers[0],
        metric: mentionedNumeric || numericColumns[0],
        aggregation: 'avg',
        chartType: 'bar',
        insight: 'Calculating averages across categories.',
        title: `Average ${mentionedNumeric || numericColumns[0] || 'Value'}`
      }
    }
  }

  if (query.includes('by') || query.includes('per') || query.includes('each') || query.includes('group')) {
    const byMatch = query.match(/by\s+(\w+)/i)
    const groupCol = byMatch
      ? headers.find(h => h.toLowerCase().includes(byMatch[1]))
      : mentionedString || stringColumns[0]

    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'group',
        groupBy: groupCol || stringColumns[0] || headers[0],
        metric: mentionedNumeric || numericColumns[0],
        aggregation: query.includes('count') ? 'count' : 'sum',
        chartType: 'bar',
        insight: 'Grouping data for comparison.',
        title: `${mentionedNumeric || numericColumns[0] || 'Value'} by ${groupCol || 'Category'}`
      }
    }
  }

  if (query.includes('stats') || query.includes('statistics') || query.includes('describe')) {
    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'stats',
        column: mentionedNumeric || numericColumns[0],
        chartType: 'bar',
        insight: 'Computing statistical summary.',
        title: `Statistics for ${mentionedNumeric || numericColumns[0] || 'data'}`
      }
    }
  }

  if (query.includes('summary') || query.includes('overview') || query.includes('show all') || query.includes('describe')) {
    return {
      success: true,
      source: 'fallback',
      query: {
        operation: 'summary',
        chartType: 'bar',
        insight: 'Generating a complete data summary.',
        title: 'Data Summary'
      }
    }
  }

  // Default: group by first string column, sum first numeric column
  return {
    success: true,
    source: 'fallback',
    query: {
      operation: numericColumns.length > 0 ? 'group' : 'summary',
      groupBy: stringColumns[0] || headers[0],
      metric: numericColumns[0],
      aggregation: 'sum',
      chartType: 'bar',
      insight: 'Analyzing your data based on available columns.',
      title: `Analysis of ${numericColumns[0] || 'data'}`
    }
  }
}

/**
 * Generate fallback insight text without AI
 */
function generateFallbackInsight(queryResult) {
  const { type, data, title } = queryResult

  if (type === 'stats' && data) {
    return `The ${data.column} column has a mean of ${data.mean} with values ranging from ${data.min} to ${data.max}. The standard deviation is ${data.stdDev}, indicating ${data.stdDev / data.mean < 0.3 ? 'relatively consistent' : 'significant variation in'} values.`
  }

  if (type === 'chart' && Array.isArray(data) && data.length > 0) {
    const first = data[0]
    const keys = Object.keys(first)
    const valueKey = keys.find(k => typeof first[k] === 'number' && k !== 'count') || keys[1]
    return `The analysis shows ${data.length} categories. The leading entry has a value of ${first[valueKey]}.`
  }

  if (type === 'table' && Array.isArray(data)) {
    return `Found ${data.length} matching results. Review the table for detailed breakdown.`
  }

  return `Analysis complete for: ${title || 'your query'}. Review the visualization for detailed insights.`
}

export default { processNaturalLanguageQuery, generateInsight }
