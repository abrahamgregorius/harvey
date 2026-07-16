import express from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// GET all fields
app.get('/api/fields', async (req, res) => {
  const { data, error } = await supabase
    .from('fields')
    .select('*, crop_phases(*), risk_scores(*)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST new field
app.post('/api/fields', async (req, res) => {
  const { data, error } = await supabase
    .from('fields')
    .insert([req.body])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT update field
app.put('/api/fields/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('fields')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE field by id
app.delete('/api/fields/:id', async (req, res) => {
  const { error } = await supabase
    .from('fields')
    .delete()
    .eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
})

// GET weather data for a field
app.get('/api/fields/:id/weather', async (req, res) => {
  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .eq('field_id', req.params.id)
    .order('recorded_at', { ascending: false })
    .limit(30)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST weather data
app.post('/api/weather', async (req, res) => {
  const { data, error } = await supabase
    .from('weather_data')
    .insert([req.body])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// GET risk scores for a field
app.get('/api/fields/:id/risks', async (req, res) => {
  const { data, error } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('field_id', req.params.id)
    .order('calculated_at', { ascending: false })
    .limit(30)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET priority rankings (all fields ranked)
app.get('/api/rankings', async (req, res) => {
  const { data, error } = await supabase
    .from('priority_rankings')
    .select('*, fields(name, area_hectares, crop_type), risk_scores(score)')
    .order('created_at', { ascending: false })
    .order('rank', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST field observation
app.post('/api/observations', async (req, res) => {
  const { data, error } = await supabase
    .from('field_observations')
    .insert([req.body])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// GET recommendations
app.get('/api/recommendations', async (req, res) => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*, fields(name, crop_type)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HARVEY backend running on :${PORT}`))
