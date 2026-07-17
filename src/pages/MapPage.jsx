import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    MapContainer, TileLayer, Polyline, CircleMarker, Polygon,
    useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import UndoIcon from '@mui/icons-material/Undo'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import Paper from '@mui/material/Paper'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import { getBrowserLocation, calcAreaFromPoints, calcCentroidFromPoints } from '../services/geoService.js'
import { getWeatherSummary } from '../services/weatherService.js'
import { getSoilSummary } from '../services/soilService.js'
import { getLast30DaysRainfall } from '../services/rainfallService.js'

// ── Map center updater ───────────────────────────────────────────────────────
function MapUpdater({ center, zoom }) {
    const map = useMap()
    useEffect(() => {
        if (center) map.flyTo(center, zoom, { duration: 1.2 })
    }, [center, zoom, map])
    return null
}

// ── Map click handler ─────────────────────────────────────────────────────────
function MapClicker({ onClick }) {
    const map = useMap()
    useEffect(() => {
        const h = (e) => onClick(e.latlng)
        map.on('click', h)
        return () => map.off('click', h)
    }, [map])
    return null
}

const DEFAULT_CENTER = [-6.9, 107.6]
const DEFAULT_ZOOM = 10

export default function MapPage({ fields, onFieldCreate }) {
    const [center, setCenter] = useState(DEFAULT_CENTER)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    const [drawPoints, setDrawPoints] = useState([])
    const [showFieldModal, setShowFieldModal] = useState(false)
    const [fieldForm, setFieldForm] = useState({ name: '', plantingDate: '' })
    const [saving, setSaving] = useState(false)
    const [highlightedField, setHighlightedField] = useState(null) // polygon just created
    const nameInputRef = useRef(null)

    useEffect(() => {
        if (showFieldModal && nameInputRef.current) {
            setTimeout(() => nameInputRef.current?.focus(), 100)
        }
    }, [showFieldModal])

    const handleModalConfirm = async () => {
        if (!fieldForm.name.trim()) return
        setSaving(true)
        try {
            const { lat, lon } = calcCentroidFromPoints(drawPoints)
            const area_ha = calcAreaFromPoints(drawPoints)

            const [weather, soil, rainfallArr] = await Promise.all([
                getWeatherSummary(lat, lon),
                getSoilSummary(lat, lon),
                getLast30DaysRainfall(lat, lon),
            ])

            const rainfall30d = rainfallArr?.length > 0
                ? {
                    total_mm: Number(rainfallArr.reduce((a, b) => a + b, 0)).toFixed(1),
                    avg_mm: Number(rainfallArr.reduce((a, b) => a + b, 0) / rainfallArr.length).toFixed(1),
                }
                : null

            const finalField = {
                name: fieldForm.name,
                lat,
                lon,
                area_ha,
                plantingDate: fieldForm.plantingDate || null,
                polygonPoints: drawPoints,
                ...(weather ?? {}),
                ...(soil ?? {}),
                rainfall30d,
            }

            if (onFieldCreate) onFieldCreate(finalField)
            setHighlightedField(drawPoints)
            setTimeout(() => setHighlightedField(null), 4000)
            setShowFieldModal(false)
            setFieldForm({ name: '', plantingDate: '' })
            setDrawPoints([])
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const finishedPolygons = fields.filter(f => f.polygonPoints).map(f => f.polygonPoints)

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Map */}
            <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapUpdater center={center} zoom={zoom} />
                    <MapClicker onClick={latlng => setDrawPoints(p => [...p, latlng])} />

                    {/* Saved field polygons */}
                    {finishedPolygons.map((pts, i) => (
                        <Polygon
                            key={i}
                            positions={pts}
                            pathOptions={{
                                color: '#2e7d32',
                                weight: 2,
                                fillColor: '#2e7d32',
                                fillOpacity: 0.15,
                            }}
                        />
                    ))}

                    {/* Drawing preview */}
                    {drawPoints.length > 0 && (
                        <>
                            <Polyline
                                positions={drawPoints}
                                pathOptions={{ color: '#4caf50', weight: 2.5, dashArray: '6 4' }}
                            />
                            {drawPoints.map((p, i) => (
                                <CircleMarker
                                    key={i}
                                    center={p}
                                    radius={i === 0 ? 8 : 5}
                                    pathOptions={{
                                        color: '#2e7d32',
                                        fillColor: i === 0 ? '#2e7d32' : '#ffffff',
                                        fillOpacity: 1,
                                        weight: 2,
                                    }}
                                />
                            ))}
                            {drawPoints.length >= 2 && (
                                <Polyline
                                    positions={[drawPoints[drawPoints.length - 1], drawPoints[0]]}
                                    pathOptions={{ color: '#4caf50', weight: 1.5, dashArray: '4 4', opacity: 0.6 }}
                                />
                            )}
                        </>
                    )}

                    {/* Highlighted newly-created polygon */}
                    {highlightedField && (
                        <Polygon
                            positions={highlightedField}
                            pathOptions={{
                                color: '#0288d1',
                                weight: 3,
                                fillColor: '#03a9f4',
                                fillOpacity: 0.25,
                                dashArray: '8 4',
                            }}
                        />
                    )}
                </MapContainer>

                {/* Controls */}
                <Box sx={{
                    position: 'absolute', bottom: 16, right: 16, zIndex: 600, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end',
                }}>
                    {highlightedField && (
                        <Paper
                            elevation={3}
                            component={Link}
                            to="/dashboard/fields"
                            sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textDecoration: 'none', cursor: 'pointer' }}
                        >
                            <CheckCircleOutlineIcon fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>Lahan disimpan!</Typography>
                        </Paper>
                    )}
                    <Button
                        startIcon={<MyLocationIcon />}
                        onClick={async () => {
                            try {
                                const loc = await getBrowserLocation()
                                setCenter([loc.lat, loc.lon])
                                setZoom(16)
                            } catch (e) { console.error(e) }
                        }}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                        Lokasi Saya
                    </Button>
                </Box>

                <Box sx={{
                    position: 'absolute', top: 16, right: 16, zIndex: 600, display: 'flex', gap: 1,
                }}>
                    <Button
                        startIcon={<UndoIcon />}
                        onClick={() => setDrawPoints(p => p.slice(0, -1))}
                        disabled={drawPoints.length === 0}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                       Undo
                    </Button>
                    <Button
                        startIcon={<ClearIcon />}
                        onClick={() => setDrawPoints([])}
                        disabled={drawPoints.length === 0}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                        Clear
                    </Button>
                    <Button
                        startIcon={<CheckIcon />}
                        onClick={() => drawPoints.length >= 3 && setShowFieldModal(true)}
                        disabled={drawPoints.length < 3}
                        size="small"
                        variant="contained"
                    >
                        Finish
                    </Button>
                </Box>

                {/* Point counter */}
                {drawPoints.length > 0 && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 600 }}>
                        <Chip
                            label={`${drawPoints.length} titik${drawPoints.length < 3 ? ` (min ${3 - drawPoints.length} lagi)` : ''}`}
                            size="small"
                            sx={{ bgcolor: 'white', fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
                        />
                    </Box>
                )}

                {/* Legend */}
                <Box sx={{
                    position: 'absolute', bottom: 16, left: 16, zIndex: 600,
                    bgcolor: 'white', borderRadius: 1.5, px: 1.5, py: 1,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }}>
                    <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, border: '2px solid #2e7d32', borderRadius: '2px', bgcolor: 'rgba(46,125,50,0.15)' }} />
                            <Typography variant="caption">Lahan tersimpan</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, border: '2px dashed #4caf50', borderRadius: '2px' }} />
                            <Typography variant="caption">Gambar baru</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 14, height: 14, border: '2px dashed #0288d1', borderRadius: '2px', bgcolor: 'rgba(2,136,209,0.15)' }} />
                            <Typography variant="caption">Baru disimpan</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            {/* Save field modal */}
            <Dialog open={showFieldModal} onClose={() => !saving && setShowFieldModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Simpan Lahan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {saving ? 'Mengambil data lahan...' : 'Lengkapi info lahan sebelum menyimpan.'}
                    </DialogContentText>
                    <Box mt={1}>
                        <Stack spacing={2}>
                            <TextField
                                inputRef={nameInputRef}
                                label="Nama Lahan"
                                value={fieldForm.name}
                                onChange={e => setFieldForm(f => ({ ...f, name: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && !saving && handleModalConfirm()}
                                disabled={saving}
                                fullWidth size="small"
                            />
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel shrink htmlFor="map-planting-date">Tanggal Tanam</InputLabel>
                                <OutlinedInput
                                    id="map-planting-date"
                                    type="date"
                                    value={fieldForm.plantingDate}
                                    onChange={e => setFieldForm(f => ({ ...f, plantingDate: e.target.value }))}
                                    label="Tanggal Tanam"
                                    disabled={saving}
                                />
                            </FormControl>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setShowFieldModal(false)} color="inherit" size="small" disabled={saving}>Batal</Button>
                    <Button onClick={handleModalConfirm} variant="contained" size="small" disabled={saving}>
                        {saving ? <CircularProgress size={16} color="inherit" /> : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
