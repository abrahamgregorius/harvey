import { ENDPOINTS } from '../config/dataConfig.js'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  return res.json()
}

/** Open-Meteo — current + 5-day forecast. Elevation bundled. */
export async function getWeatherSummary(lat, lon) {
  const data = await fetchJSON(ENDPOINTS.openMeteo.current(lat, lon))
  const cur = data?.current
  const daily = data?.daily
  return {
    temp: cur.temperature_2m,
    humidity: cur.relative_humidity_2m,
    rainfall_mm: cur.precipitation,
    windSpeed: cur.wind_speed_10m,
    weatherCode: cur.weather_code,
    description: wmoCodeToDesc(cur.weather_code),
    elevation: data.elevation,
    forecast: daily?.time?.map((t, i) => ({
      date: t,
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipMm: daily.precipitation_sum[i],
      weatherCode: daily.weather_code[i],
      description: wmoCodeToDesc(daily.weather_code[i]),
    })),
  }
}

/**
 * Historical rainfall (30-day archive) — CHIRPS substitute via Open-Meteo archive.
 * Start/end: ISO date strings e.g. "2024-01-01", "2024-01-31".
 * Returns daily precipitation array.
 */
export async function getRainfallHistory(lat, lon, startDate, endDate) {
  const data = await fetchJSON(ENDPOINTS.openMeteo.archive(lat, lon, startDate, endDate))
  return data.daily.precipitation_sum // array of mm per day
}

function wmoCodeToDesc(code) {
  const map = {
    0: 'Cerah', 1: 'Cerah', 2: 'Parsial berawan', 3: 'Berawan',
    45: 'Kabut', 48: 'Kabut beku',
    51: 'Gerimis ringan', 53: 'Gerimis sedang', 55: 'Gerimis berat',
    61: 'Hujan ringan', 63: 'Hujan sedang', 65: 'Hujan berat',
    71: 'Salju ringan', 73: 'Salju sedang', 75: 'Salju berat',
    80: 'Hujan lokal ringan', 81: 'Hujan lokal sedang', 82: 'Hujan lokal berat',
    95: 'Badai petir', 96: 'Badai petir+salju', 99: 'Badai petir berat+salju',
  }
  return map[code] ?? `Kode ${code}`
}
