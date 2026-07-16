/**
 * Elevation service.
 * ponytail: elevation is returned for free inside Open-Meteo's weather response.
 * Separate SRTM call is unnecessary for MVP. Keeping this file as a stub
 * for when multi-point slope calculation is needed (3×3 DEM window).
 */
export async function getElevation(lat, lon) {
  // ponytail: OpenTopography requires auth, USGS NationalMap out-of-coverage for Indonesia.
  // Elevation comes bundled in Open-Meteo weather response — no extra API call.
  // This function is a no-op placeholder until slope-from-DEM is implemented.
  return null // elevation must be extracted from weatherService response
}
