/** @format */

import { getRainfallHistory } from "./weatherService.js";

export async function getLast30DaysRainfall(lat, lon) {
	const end = new Date();
	const start = new Date();
	start.setDate(start.getDate() - 30);
	const fmt = (d) => d.toISOString().slice(0, 10);
	return getRainfallHistory(lat, lon, fmt(start), fmt(end));
}
