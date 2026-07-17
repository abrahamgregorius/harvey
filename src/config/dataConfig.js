/** @format */

export const ENDPOINTS = {
	openMeteo: {
		current: (lat, lon) =>
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
			`&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
			`&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
			`&timezone=Asia%2FJakarta&forecast_days=5`,
		// Historical archive for rainfall  CHIRPS substitute (30-day window)
		archive: (lat, lon, start, end) =>
			`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
			`&start_date=${start}&end_date=${end}` +
			`&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
			`&timezone=Asia%2FJakarta`,
	},
};
