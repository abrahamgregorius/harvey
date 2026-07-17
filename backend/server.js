import express from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'
import { calculateDailyRiskScore } from './risk-engine.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// GET all fields
app.get('/api/fields', async (req, res) => {
  const { data, error } = await supabase
    .from('fields')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data.map(mapFieldFromDb))
})

// Map frontend names → DB column names
function mapFieldToDb(f) {
  return {
    name: f.name,
    area_hectares: f.area_ha ?? f.area_hectares,
    latitude: f.lat ?? f.latitude,
    longitude: f.lon ?? f.longitude,
    plant_date: f.plantingDate ?? f.plant_date,
    soil_type: f.soilType ?? f.soil_type,
    crop_type: f.crop_type,
    variety: f.variety,
    polygon_points: f.polygonPoints,
    temp: f.temp,
    humidity: f.humidity,
    wind_speed: f.windSpeed,
    rainfall_mm: f.rainfall_mm,
    elevation: f.elevation,
    description: f.description,
    rainfall30d: f.rainfall30d ? JSON.stringify(f.rainfall30d) : null,
  }
}

// Map DB row → frontend names
function mapFieldFromDb(f) {
  if (!f) return null
  return {
    id: f.id,
    name: f.name,
    area_ha: f.area_hectares,
    lat: f.latitude,
    lon: f.longitude,
    plantingDate: f.plant_date,
    soilType: f.soil_type,
    crop_type: f.crop_type,
    variety: f.variety,
    temp: f.temp,
    humidity: f.humidity,
    windSpeed: f.wind_speed,
    rainfall_mm: f.rainfall_mm,
    elevation: f.elevation,
    description: f.description,
    polygonPoints: f.polygon_points,
    rainfall30d: f.rainfall30d ? (typeof f.rainfall30d === 'string' ? JSON.parse(f.rainfall30d) : f.rainfall30d) : null,
    createdAt: f.created_at,
  }
}

// POST new field
app.post('/api/fields', async (req, res) => {
  const mapped = mapFieldToDb(req.body)
  const { data, error } = await supabase
    .from('fields')
    .insert([mapped])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(mapFieldFromDb(data))
})

// PUT update field
app.put('/api/fields/:id', async (req, res) => {
  const mapped = mapFieldToDb(req.body)
  const { data, error } = await supabase
    .from('fields')
    .update({ ...mapped, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(mapFieldFromDb(data))
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

// POST calculate risk
app.post('/api/calculate-risk', (req, res) => {
  try {
    const result = calculateDailyRiskScore(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// POST batch risk for multiple fields (single point in time)
app.post('/api/risks/batch', (req, res) => {
  const { fields } = req.body;
  if (!Array.isArray(fields)) {
    return res.status(400).json({ error: 'fields must be an array' });
  }
  const results = fields.map((f, i) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const elNino = f.elNino ?? 0;
      const avgDailyRainfall = f.forecast?.[0]?.precipMm ?? f.rainfall30d?.avg_mm ?? f.rainfall_mm ?? 0;
      const adjRainfall = Math.max(0, avgDailyRainfall * (1 - elNino * 0.08));
      const adjTempMax = (f.temp ?? 30) * (1 + elNino * 0.02);
      const result = calculateDailyRiskScore({
        soilType: f.soilType,
        cropType: f.crop_type ?? "Padi",
        plantDate: f.plantingDate,
        logDate: today,
        latitude: f.lat,
        tempMax: adjTempMax,
        tempMin: adjTempMax - 5,
        rainfallMm: adjRainfall,
        irrigationMm: f.irrigation_mm ?? 0,
      });
      return { index: i, ...result };
    } catch (e) {
      return { index: i, error: e.message };
    }
  });
  res.json(results);
});

// GET 30-day risk history for a field
app.get('/api/risks/history/:fieldId', async (req, res) => {
  const { fieldId } = req.params;
  const days = parseInt(req.query.days) || 30;
  const limit = Math.min(days, 365);

  const { data: field, error: fieldError } = await supabase
    .from('fields')
    .select('*')
    .eq('id', fieldId)
    .single();
  if (fieldError) return res.status(404).json({ error: 'field not found' });

  const { data: weatherRows } = await supabase
    .from('weather_data')
    .select('*')
    .eq('field_id', fieldId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  const weatherMap = {};
  if (weatherRows) {
    weatherRows.forEach((w) => {
      const d = new Date(w.recorded_at).toISOString().split('T')[0];
      if (!weatherMap[d]) {
        weatherMap[d] = { rainfall_mm: w.rainfall_mm ?? 0, temp_max: w.temp_max ?? w.temp ?? 30, temp_min: w.temp_min ?? (w.temp ?? 30) - 5 };
      }
    });
  }

  const history = [];
  for (let i = limit - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const w = weatherMap[dateStr] || {};
    const elNino = parseFloat(req.query.elNino) || 0;
    const fieldAvgRain = field.rainfall30d?.avg_mm ?? field.rainfall_mm ?? 0;
    const adjRainfall = Math.max(0, (w.rainfall_mm ?? fieldAvgRain) * (1 - elNino * 0.08));
    const adjTempMax = ((w.temp_max ?? field.temp ?? 30)) * (1 + elNino * 0.02);
    try {
      const result = calculateDailyRiskScore({
        soilType: field.soil_type,
        cropType: field.crop_type,
        plantDate: field.plant_date,
        logDate: dateStr,
        latitude: field.latitude,
        tempMax: adjTempMax,
        tempMin: adjTempMax - 5,
        rainfallMm: adjRainfall,
        irrigationMm: 0,
      });
      history.push({ date: dateStr, ...result });
    } catch (e) {
      history.push({ date: dateStr, error: e.message });
    }
  }
  res.json(history);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HARVEY backend running on :${PORT}`))
