/**
 * Rainfall history — CHIRPS substitute via Open-Meteo archive API.
 * CHIRPS official API requires GEE token — no free direct endpoint.
 * ponytail: Open-Meteo archive provides precipitation_sum (mm) which is
 * close enough for MVP risk scoring. 30-day window is the free limit.
 */
import { getRainfallHistory } from './weatherService.js'

export async function getLast30DaysRainfall(lat, lon) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  const fmt = (d) => d.toISOString().slice(0, 10)
  return getRainfallHistory(lat, lon, fmt(start), fmt(end))
}
