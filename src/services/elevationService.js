/** @format */

export async function getElevation(lat, lon) {
	// ponytail: OpenTopography requires auth, USGS NationalMap out-of-coverage for Indonesia.
	// Elevation comes bundled in Open-Meteo weather response — no extra API call.
	// This function is a no-op placeholder until slope-from-DEM is implemented.
	return null; // elevation must be extracted from weatherService response
}
