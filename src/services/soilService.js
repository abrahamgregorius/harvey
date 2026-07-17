/** @format */

const INDONESIA_SOIL_ZONES = [
	[-8.5, -5.5, 105.0, 114.0, "Andosol", 35, 25, 40, "Jawa vulkanik"],
	[-6.0, 6.0, 95.0, 105.0, "Peat / Histosol", 55, 10, 35, "Sumatra gambut"],
	[-4.0, 4.0, 108.0, 119.0, "Acrisol", 20, 65, 15, "Kalimantan mineral"],
	[-7.5, 2.0, 118.0, 125.0, "Nitisol", 40, 30, 30, "Sulawesi vulkanik"],
	[-9.0, -7.5, 114.5, 116.5, "Cambisol", 25, 55, 20, "Bali kering kapur"],
	[-6.5, -1.0, 130.0, 140.0, "Ferralsol", 15, 70, 15, "Papua laterit"],
];

/** Returns static soil data for Indonesia bounding-box lookup */
function getStaticSoil(lat, lon) {
	for (const [
		latMin,
		latMax,
		lonMin,
		lonMax,
		soilType,
		clay,
		sand,
		silt,
		note,
	] of INDONESIA_SOIL_ZONES) {
		if (lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax) {
			return {
				soilType,
				clay_pct: clay,
				sand_pct: sand,
				silt_pct: silt,
				note: `Zona: ${note}`,
			};
		}
	}
	return {
		soilType: "Latosol",
		clay_pct: 30,
		sand_pct: 40,
		silt_pct: 30,
		note: "Zona default Indonesia",
	};
}

export async function getSoilSummary(lat, lon) {
	return getStaticSoil(lat, lon);
}
