import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'fields.json')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Load existing data
function load() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return []
  }
}

// Save data
function save(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET all fields
app.get('/api/fields', (req, res) => {
  res.json(load())
})

// POST new field
app.post('/api/fields', (req, res) => {
  const field = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...req.body
  }
  const fields = load()
  fields.push(field)
  save(fields)
  res.status(201).json(field)
})

// DELETE field by id
app.delete('/api/fields/:id', (req, res) => {
  const fields = load().filter(f => f.id !== req.params.id)
  save(fields)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HARVEY backend running on :${PORT}`))
