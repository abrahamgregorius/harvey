import * as turf from '@turf/turf'

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

export function calcPolygonAreaHectares(polygonLayer) {
  const coords = polygonLayer.getLatLngs()[0]
  const ring = coords.map((c) => [c.lng, c.lat])
  ring.push(ring[0])
  const poly = turf.polygon([ring])
  const sqMeters = turf.area(poly)
  return sqMeters / 10000
}

export function getPolygonCentroid(polygonLayer) {
  const coords = polygonLayer.getLatLngs()[0]
  const ring = coords.map((c) => [c.lng, c.lat])
  ring.push(ring[0])
  const poly = turf.polygon([ring])
  const centroid = turf.centroid(poly)
  return { lat: centroid.geometry.coordinates[1], lon: centroid.geometry.coordinates[0] }
}

export function calcAreaFromPoints(points) {
  if (!points || points.length < 3) return 0
  const ring = points.map((c) => [c.lng, c.lat])
  ring.push(ring[0])
  const poly = turf.polygon([ring])
  return turf.area(poly) / 10000
}

export function calcCentroidFromPoints(points) {
  if (!points || points.length < 3) return { lat: 0, lon: 0 }
  const ring = points.map((c) => [c.lng, c.lat])
  ring.push(ring[0])
  const poly = turf.polygon([ring])
  const centroid = turf.centroid(poly)
  return { lat: centroid.geometry.coordinates[1], lon: centroid.geometry.coordinates[0] }
}

export function calcSlope(pointA, pointB, pointC) {
  const line = turf.lineString([[pointA.lon, pointA.lat], [pointB.lon, pointB.lat]])
  const elevationDiff = pointB.elevation - pointA.elevation
  const distance = turf.length(line, { units: 'meters' })
  if (distance === 0) return 0
  return (elevationDiff / distance) * 100
}
