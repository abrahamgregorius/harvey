import * as turf from '@turf/turf'

/** Get browser geolocation — returns {lat, lon} or throws */
export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

/**
 * Calculate polygon area in hectares from Leaflet layer.
 * Expects a Leaflet Polygon layer (has getLatLngs()).
 */
export function calcPolygonAreaHectares(polygonLayer) {
  const coords = polygonLayer.getLatLngs()[0] // outer ring
  const ring = coords.map((c) => [c.lng, c.lat])
  ring.push(ring[0]) // close
  const poly = turf.polygon([ring])
  const sqMeters = turf.area(poly)
  return sqMeters / 10000 // ha
}

/** Get centroid of polygon layer as {lat, lon} */
export function getPolygonCentroid(polygonLayer) {
  const coords = polygonLayer.getLatLngs()[0]
  const ring = coords.map((c) => [c.lng, c.lat])
  ring.push(ring[0])
  const poly = turf.polygon([ring])
  const centroid = turf.centroid(poly)
  return { lat: centroid.geometry.coordinates[1], lon: centroid.geometry.coordinates[0] }
}

/** Calculate slope (%) from three points forming a triangle */
export function calcSlope(pointA, pointB, pointC) {
  // slope from A to B, C is reference elevation
  const line = turf.lineString([[pointA.lon, pointA.lat], [pointB.lon, pointB.lat]])
  const elevationDiff = pointB.elevation - pointA.elevation
  const distance = turf.length(line, { units: 'meters' })
  if (distance === 0) return 0
  return (elevationDiff / distance) * 100
}
