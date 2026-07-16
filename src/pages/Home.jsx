import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import {
    MapContainer, TileLayer, Polyline, CircleMarker, Polygon, useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import TerrainIcon from '@mui/icons-material/Terrain'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import GrassIcon from '@mui/icons-material/Grass'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import UndoIcon from '@mui/icons-material/Undo'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LayersIcon from '@mui/icons-material/Layers'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { getBrowserLocation } from '../services/geoService.js'
import { calcPolygonAreaHectares, getPolygonCentroid } from '../services/geoService.js'
import { getWeatherSummary } from '../services/weatherService.js'
import { getSoilSummary } from '../services/soilService.js'
import { getLast30DaysRainfall } from '../services/rainfallService.js'
import { storeField, getFields } from '../services/fieldStore.js'

import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Map center updater — flies to new center when state changes ─────────────
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

const theme = createTheme({
    palette: {
        primary: { main: '#2e7d32' },
        background: { default: '#f5f5f5', paper: '#ffffff' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    shape: { borderRadius: 10 },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
            },
        },
    },
})

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                {title}
            </Typography>
        </Stack>
    )
}

// ── Data row ─────────────────────────────────────────────────────────────────
function DataRow({ icon, label, value, unit = '' }) {
    if (value == null || value === '') return null
    return (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.3 }}>
            {icon && <Box sx={{ color: 'text.disabled', display: 'flex', minWidth: 20 }}>{icon}</Box>}
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{label}</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                {value}{unit}
            </Typography>
        </Stack>
    )
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit = '', highlight = false }) {
    return (
        <Box sx={{
            flex: 1,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: highlight ? 'primary.main' : 'grey.50',
            color: highlight ? 'white' : 'text.primary',
        }}>
            <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', opacity: highlight ? 0.9 : 0.6 }}>{icon}</Box>
                    <Typography variant="caption" sx={{ opacity: highlight ? 0.9 : 0.6, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>
                        {label}
                    </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700}>
                    {value}{unit}
                </Typography>
            </Stack>
        </Box>
    )
}

// ── Field panel ──────────────────────────────────────────────────────────────
function FieldPanel({ fields }) {
    const [collapsed, setCollapsed] = useState(new Set())

    const toggle = (idx) => {
        setCollapsed((prev) => {
            const next = new Set(prev)
            next.has(idx) ? next.delete(idx) : next.add(idx)
            return next
        })
    }

    if (!fields?.length) return null
    return (
        <Stack spacing={2}>
            {fields.map((field, idx) => {
                const isCollapsed = collapsed.has(idx)
                return (
                <Paper key={idx} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                    {/* Field name header — clickable to collapse */}
                    <Box
                        sx={{ bgcolor: 'primary.main', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        onClick={() => toggle(idx)}
                    >
                        <LocationOnIcon sx={{ color: 'white', fontSize: 18 }} />
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'white', flex: 1 }}>
                            {field.name ?? `Lahan ${idx + 1}`}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'white', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Collapse in={!isCollapsed}>
                        <Box sx={{ p: 2 }}>
                        {/* Primary stats row */}
                        <Stack direction="row" spacing={1} mb={2}>
                            <StatCard
                                icon={<TerrainIcon sx={{ fontSize: 14 }} />}
                                label="Luas"
                                value={field.area_ha?.toFixed(2)}
                                unit=" ha"
                                highlight={false}
                            />
                            <StatCard
                                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                label="Elevasi"
                                value={field.elevation ?? '—'}
                                unit=" m"
                                highlight={false}
                            />
                        </Stack>

                        {/* Coordinates */}
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">Koordinat</Typography>
                            <Typography variant="body2" fontWeight={500}>{field.lat?.toFixed(5)}, {field.lon?.toFixed(5)}</Typography>
                        </Box>

                        {/* Weather */}
                        <SectionHeader icon={<WbSunnyIcon sx={{ fontSize: 16 }} />} title="Cuaca Saat Ini" />
                        <Stack direction="row" spacing={1} mb={2}>
                            <StatCard icon={<WbSunnyIcon sx={{ fontSize: 14 }} />} label="Suhu" value={field.temp != null ? field.temp.toFixed(1) : '—'} unit="°C" />
                            <StatCard icon={<WaterDropIcon sx={{ fontSize: 14 }} />} label="Humid" value={field.humidity ?? '—'} unit="%" />
                            <StatCard icon={<AirIcon sx={{ fontSize: 14 }} />} label="Angin" value={field.windSpeed != null ? field.windSpeed.toFixed(1) : '—'} unit=" km/h" />
                        </Stack>

                        {field.description && (
                            <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WbSunnyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">{field.description}</Typography>
                            </Box>
                        )}

                        {/* Rainfall */}
                        {field.rainfall_mm != null && (
                            <Box sx={{ mb: 2 }}>
                                <SectionHeader icon={<WaterDropIcon sx={{ fontSize: 16 }} />} title="Curah Hujan" />
                                <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Typography variant="body1" fontWeight={700}>{field.rainfall_mm} mm</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Soil */}
                        {field.soilType && (
                            <Box sx={{ mb: 2 }}>
                                <SectionHeader icon={<GrassIcon sx={{ fontSize: 16 }} />} title="Tanah" />
                                <Stack spacing={0.5}>
                                    <DataRow label="Jenis" value={field.soilType} />
                                    {field.clay_pct != null && (
                                        <DataRow label="Clay/Sand/Silt" value={`${field.clay_pct}/${field.sand_pct}/${field.silt_pct}`} unit="%" />
                                    )}
                                    {field.note && (
                                        <Typography variant="caption" color="text.secondary">{field.note}</Typography>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {/* Rainfall 30d */}
                        {field.rainfall30d && (
                            <Box sx={{ mb: 2 }}>
                                <SectionHeader icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />} title="Curah Hujan 30 Hari" />
                                <Stack direction="row" spacing={1}>
                                    <StatCard icon={<WaterDropIcon sx={{ fontSize: 14 }} />} label="Total" value={field.rainfall30d.total_mm} unit=" mm" />
                                    <StatCard icon={<WaterDropIcon sx={{ fontSize: 14 }} />} label="Rata-rata" value={field.rainfall30d.avg_mm} unit=" mm/h" />
                                </Stack>
                            </Box>
                        )}

                        {/* Forecast */}
                        {field.forecast?.length > 0 && (
                            <Box>
                                <SectionHeader icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />} title="Prakiraan 5 Hari" />
                                <Stack spacing={0.5}>
                                    {field.forecast.map((f, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.75, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Typography variant="caption" sx={{ minWidth: 44, color: 'text.secondary', fontWeight: 500 }}>
                                                {f.date?.slice(5)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ flex: 1 }}>{f.description}</Typography>
                                            <Typography variant="caption" fontWeight={600}>{f.tempMin}–{f.tempMax}°C</Typography>
                                            <Chip
                                                label={`${f.precipMm}mm`}
                                                size="small"
                                                sx={{
                                                    height: 16,
                                                    fontSize: '0.6rem',
                                                    fontWeight: 700,
                                                    bgcolor: f.precipMm > 5 ? 'primary.light' : 'grey.200',
                                                    color: f.precipMm > 5 ? 'primary.dark' : 'text.secondary',
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                    </Collapse>
                </Paper>
                )
            })}
        </Stack>
    )
}

// ── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const [fields, setFields] = useState([])
    const [loading, setLoading] = useState(false)
    const [locBtn, setLocBtn] = useState(false)
    const [drawPoints, setDrawPoints] = useState([])
    const [finishedPolygons, setFinishedPolygons] = useState([])
    const [center, setCenter] = useState([-6.2, 106.8])
    const [zoom, setZoom] = useState(8)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
    const [fieldForm, setFieldForm] = useState({ name: '', plantingDate: '' })
    const [showFieldModal, setShowFieldModal] = useState(false)

    const showMsg = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleModalConfirm = () => {
        if (!fieldForm.name.trim()) {
            showMsg('Nama lahan wajib diisi', 'warning')
            return
        }
        setShowFieldModal(false)
        handleDrawn(drawPoints)
    }

    const handleModalClose = () => {
        setShowFieldModal(false)
    }

    // Restore fields + polygons from backend on mount
    useEffect(() => {
        getFields().then(data => {
            setFields(data)
            setFinishedPolygons(data.filter(f => f.polygonPoints).map(f => f.polygonPoints))
        }).catch(e => console.error('restore fields error:', e))
    }, [])

    const handleLocate = async () => {
        setLocBtn(true)
        try {
            const { lat, lon } = await getBrowserLocation()
            setCenter([lat, lon])
            setZoom(14)
            showMsg('Lokasi ditemukan', 'success')
        } catch (e) {
            if (e?.code === 1) showMsg('Izin lokasi ditolak', 'warning')
            else if (e?.code === 2) showMsg('Lokasi tidak tersedia', 'warning')
            else showMsg('Gagal mendapat lokasi', 'error')
        } finally {
            setLocBtn(false)
        }
    }

    const handleDrawn = useCallback(async (points) => {
        setLoading(true)
        try {
            const poly = { getLatLngs: () => [points] }
            const { lat, lon } = getPolygonCentroid(poly)
            const area_ha = calcPolygonAreaHectares(poly)
            const newField = { name: fieldForm.name || `Lahan ${Date.now()}`, lat, lon, area_ha, plantingDate: fieldForm.plantingDate || null }

            const weather = await getWeatherSummary(lat, lon)
            const soil = await getSoilSummary(lat, lon)
            const rainfallArr = await getLast30DaysRainfall(lat, lon)

            const rainfall30d = rainfallArr && rainfallArr.length > 0
                ? {
                    total_mm: Number(rainfallArr.reduce((a, b) => a + b, 0)).toFixed(1),
                    avg_mm: Number(rainfallArr.reduce((a, b) => a + b, 0) / rainfallArr.length).toFixed(1),
                  }
                : null

            const finalField = { ...newField, ...(weather ?? {}), ...(soil ?? {}), rainfall30d, polygonPoints: points }
            setFields((prev) => [...(prev ?? []), finalField])
            setFinishedPolygons((prev) => [...prev, points])
            setDrawPoints([])
            setFieldForm({ name: '', plantingDate: '' })
            setModalDone(false)

            // Save to backend
            storeField(finalField).catch(e => console.error('backend sync error:', e))
        } catch (e) {
            console.error('handleDrawn error:', e)
            showMsg(`Gagal: ${e.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Header */}
                <Box sx={{
                    bgcolor: 'primary.main',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ bgcolor: 'white', borderRadius: 1, p: 0.5, display: 'flex' }}>
                            <LayersIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: 'white', lineHeight: 1.1, letterSpacing: 1 }}>
                                HARVEY
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>
                                Pantau Risiko Lahan
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button
                            component={Link}
                            to="/dashboard"
                            startIcon={<DashboardIcon />}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)', color: 'white',
                                fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                                px: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                            }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<MyLocationIcon />}
                            onClick={handleLocate}
                            disabled={locBtn}
                            sx={{
                                bgcolor: 'white', color: 'primary.main',
                                fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                                px: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
                            }}
                        >
                            {locBtn ? 'Mendapat lokasi…' : 'Lokasi Saya'}
                        </Button>
                    </Stack>
                </Box>

                {/* Main content */}
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                        {/* Map */}
                        <Box sx={{
                            flex: 1,
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            position: 'relative',
                        }}>
                            <MapContainer center={center} zoom={zoom} style={{ height: 560, width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                                <MapUpdater center={center} zoom={zoom} />
                                <MapClicker onClick={(latlng) => setDrawPoints((p) => [...p, latlng])} />

                                {/* Finished polygons */}
                                {finishedPolygons.map((pts, i) => (
                                    <Polygon
                                        key={i}
                                        positions={pts}
                                        pathOptions={{
                                            color: '#2e7d32',
                                            weight: 2,
                                            fillColor: '#2e7d32',
                                            fillOpacity: 0.12,
                                        }}
                                    />
                                ))}

                                {/* Live drawing */}
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
                                        {/* Live closing line preview */}
                                        {drawPoints.length >= 2 && (
                                            <Polyline
                                                positions={[drawPoints[drawPoints.length - 1], drawPoints[0]]}
                                                pathOptions={{ color: '#4caf50', weight: 1.5, dashArray: '4 4', opacity: 0.6 }}
                                            />
                                        )}
                                    </>
                                )}
                            </MapContainer>

                            {/* Controls */}
                            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<UndoIcon />}
                                    onClick={() => setDrawPoints((p) => p.slice(0, -1))}
                                    disabled={drawPoints.length === 0}
                                    sx={{
                                        bgcolor: 'white', color: 'text.primary', fontWeight: 600,
                                        borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        '&:hover': { bgcolor: 'grey.100' },
                                    }}
                                >
                                    Undo
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<ClearIcon />}
                                    onClick={() => setDrawPoints([])}
                                    disabled={drawPoints.length === 0}
                                    sx={{
                                        bgcolor: 'white', color: 'text.primary', fontWeight: 600,
                                        borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        '&:hover': { bgcolor: 'grey.100' },
                                    }}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<CheckIcon />}
                                    onClick={() => {
                                        if (drawPoints.length >= 3) setShowFieldModal(true)
                                    }}
                                    disabled={drawPoints.length < 3}
                                    sx={{
                                        bgcolor: 'primary.main', fontWeight: 600,
                                        borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                    }}
                                >
                                    Finish
                                </Button>
                            </Box>

                            {/* Point counter */}
                            {drawPoints.length > 0 && (
                                <Box sx={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000 }}>
                                    <Chip
                                        label={`${drawPoints.length} titik${drawPoints.length < 3 ? ` (min ${3 - drawPoints.length} lagi)` : ''}`}
                                        size="small"
                                        sx={{
                                            bgcolor: 'white',
                                            fontWeight: 600,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Sidebar */}
                        <Box sx={{ width: 360, flexShrink: 0 }}>
                            {loading ? (
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <CircularProgress size={36} sx={{ mb: 2, color: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">Memuat data…</Typography>
                                </Paper>
                            ) : (
                                <FieldPanel fields={fields} />
                            )}
                            {fields.length === 0 && !loading && (
                                <Box sx={{ mt: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                                    <TerrainIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Klik peta untuk menggambar polygon
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">Minimal 3 titik</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ borderRadius: 1.5 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* First-point modal — field name + planting date */}
                <Dialog open={showFieldModal} onClose={handleModalClose} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ fontWeight: 700 }}>Info Lahan</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            <TextField
                                label="Nama Lahan"
                                value={fieldForm.name}
                                onChange={(e) => setFieldForm((f) => ({ ...f, name: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleModalConfirm()}
                                autoFocus
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Tanggal Tanam"
                                type="date"
                                value={fieldForm.plantingDate}
                                onChange={(e) => setFieldForm((f) => ({ ...f, plantingDate: e.target.value }))}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                placeholder=" "
                                sx={{ '& input::placeholder': { opacity: 0 } }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleModalClose} color="inherit">Batal</Button>
                        <Button onClick={handleModalConfirm} variant="contained">OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    )
}
