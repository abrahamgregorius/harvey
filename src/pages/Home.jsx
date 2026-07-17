import { useState, useCallback, useEffect, useRef } from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
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
import EditIcon from '@mui/icons-material/Edit'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LayersIcon from '@mui/icons-material/Layers'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { getBrowserLocation } from '../services/geoService.js'
import { calcPolygonAreaHectares, getPolygonCentroid } from '../services/geoService.js'
import { getWeatherSummary } from '../services/weatherService.js'
import { getSoilSummary } from '../services/soilService.js'
import { getLast30DaysRainfall } from '../services/rainfallService.js'
import { storeField, getFields, updateField } from '../services/fieldStore.js'

import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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
            <Box className="text-green-700">{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main"
                className="uppercase text-xs tracking-wide">
                {title}
            </Typography>
        </Stack>
    )
}

// ── Data row ─────────────────────────────────────────────────────────────────
function DataRow({ icon, label, value, unit = '' }) {
    if (value == null || value === '') return null
    return (
        <Stack direction="row" alignItems="center" spacing={1.5} py={0.3}>
            {icon && <Box className="text-gray-400 min-w-5">{icon}</Box>}
            <Typography variant="body2" color="text.secondary" className="flex-1">{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{value}{unit}</Typography>
        </Stack>
    )
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit = '', highlight = false }) {
    return (
        <Box className={`flex-1 p-3 rounded-xl ${highlight ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Stack spacing={1}>
                <Box className="flex items-center gap-1">
                    <Box className={highlight ? 'opacity-90' : 'opacity-60'}>{icon}</Box>
                    <Typography variant="caption" className={`uppercase text-xs tracking-wider ${highlight ? 'opacity-90' : 'opacity-60'}`}>
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
function FieldPanel({ fields, onEdit }) {
    const [collapsed, setCollapsed] = useState(new Set())
    const toggle = (idx) => {
        setCollapsed(prev => {
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
                    <Paper key={idx} elevation={0} className="border border-gray-200 rounded-2xl overflow-hidden">
                        {/* Header */}
                        <Box
                            className="bg-green-700 px-4 py-3 flex items-center gap-2 cursor-pointer"
                            onClick={() => toggle(idx)}
                        >
                            <LocationOnIcon className="text-white text-lg" />
                            <Typography variant="subtitle2" fontWeight={700} className="text-white flex-1">
                                {field.name}
                            </Typography>
                            <IconButton size="small" className="text-white" onClick={e => { e.stopPropagation(); onEdit(field) }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" className={`text-white transition-transform ${isCollapsed ? '' : 'rotate-180'}`} onClick={e => { e.stopPropagation(); toggle(idx) }}>
                                <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Collapse in={!isCollapsed}>
                            <Box className="p-4">
                                {/* Primary stats */}
                                <Stack direction="row" spacing={1} mb={4}>
                                    <StatCard icon={<TerrainIcon className="text-sm" />} label="Luas" value={field.area_ha?.toFixed(2)} unit=" ha" />
                                    <StatCard icon={<LocationOnIcon className="text-sm" />} label="Elevasi" value={field.elevation ?? '—'} unit=" m" />
                                </Stack>

                                {/* Coordinates */}
                                <Box className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <Typography variant="caption" color="text.secondary">Koordinat</Typography>
                                    <Typography variant="body2" fontWeight={500}>{field.lat?.toFixed(5)}, {field.lon?.toFixed(5)}</Typography>
                                </Box>

                                {/* Weather */}
                                <SectionHeader icon={<WbSunnyIcon className="text-sm" />} title="Cuaca Saat Ini" />
                                <Stack direction="row" spacing={1} mb={4}>
                                    <StatCard icon={<WbSunnyIcon className="text-sm" />} label="Suhu" value={field.temp != null ? field.temp.toFixed(1) : '—'} unit="°C" />
                                    <StatCard icon={<WaterDropIcon className="text-sm" />} label="Humid" value={field.humidity ?? '—'} unit="%" />
                                    <StatCard icon={<AirIcon className="text-sm" />} label="Angin" value={field.windSpeed != null ? field.windSpeed.toFixed(1) : '—'} unit=" km/h" />
                                </Stack>

                                {field.description && (
                                    <Box className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                                        <WbSunnyIcon className="text-gray-500 text-sm" />
                                        <Typography variant="body2">{field.description}</Typography>
                                    </Box>
                                )}

                                {/* Rainfall */}
                                {field.rainfall_mm != null && (
                                    <Box className="mb-4">
                                        <SectionHeader icon={<WaterDropIcon className="text-sm" />} title="Curah Hujan" />
                                        <Box className="p-3 bg-gray-50 rounded-lg">
                                            <Typography variant="body1" fontWeight={700}>{field.rainfall_mm} mm</Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Soil */}
                                {field.soilType && (
                                    <Box className="mb-4">
                                        <SectionHeader icon={<GrassIcon className="text-sm" />} title="Tanah" />
                                        <Stack spacing={1}>
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
                                    <Box className="mb-4">
                                        <SectionHeader icon={<CalendarMonthIcon className="text-sm" />} title="Curah Hujan 30 Hari" />
                                        <Stack direction="row" spacing={1}>
                                            <StatCard icon={<WaterDropIcon className="text-sm" />} label="Total" value={field.rainfall30d.total_mm} unit=" mm" />
                                            <StatCard icon={<WaterDropIcon className="text-sm" />} label="Rata-rata" value={field.rainfall30d.avg_mm} unit=" mm/h" />
                                        </Stack>
                                    </Box>
                                )}

                                {/* Forecast */}
                                {field.forecast?.length > 0 && (
                                    <Box>
                                        <SectionHeader icon={<CalendarMonthIcon className="text-sm" />} title="Prakiraan 5 Hari" />
                                        <Stack spacing={1}>
                                            {field.forecast.map((f, i) => (
                                                <Box key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                    <Typography variant="caption" className="min-w-10 text-gray-500 font-medium">
                                                        {f.date?.slice(5)}
                                                    </Typography>
                                                    <Typography variant="caption" className="flex-1">{f.description}</Typography>
                                                    <Typography variant="caption" fontWeight={600}>{f.tempMin}–{f.tempMax}°C</Typography>
                                                    <Chip
                                                        label={`${f.precipMm}mm`}
                                                        size="small"
                                                        className={`h-4 text-xs font-bold ${f.precipMm > 5 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
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
    const [editField, setEditField] = useState(null)
    const nameInputRef = useRef(null)

    useEffect(() => {
        if (showFieldModal && nameInputRef.current) {
            setTimeout(() => nameInputRef.current?.focus(), 100)
        }
    }, [showFieldModal])

    const showMsg = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleModalConfirm = () => {
        if (!fieldForm.name.trim()) {
            showMsg('Nama lahan wajib diisi', 'warning')
            return
        }
        const saved = { ...fieldForm }
        setShowFieldModal(false)
        setFieldForm({ name: '', plantingDate: '' })
        handleDrawn(drawPoints, saved)
    }

    const handleModalClose = () => setShowFieldModal(false)

    const handleEditOpen = (field) => {
        setEditField({ ...field })
    }

    const handleEditSave = async () => {
        if (!editField?.name?.trim()) {
            showMsg('Nama lahan wajib diisi', 'warning')
            return
        }
        try {
            const updated = await updateField(editField.id, editField)
            setFields(prev => prev.map(f => f.id === updated.id ? updated : f))
            setEditField(null)
            showMsg('Lahan diperbarui', 'success')
        } catch (e) {
            showMsg(`Gagal: ${e.message}`, 'error')
        }
    }

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

    const handleDrawn = useCallback(async (points, fieldData) => {
        setLoading(true)
        try {
            const poly = { getLatLngs: () => [points] }
            const { lat, lon } = getPolygonCentroid(poly)
            const area_ha = calcPolygonAreaHectares(poly)
            const newField = { name: fieldData.name, lat, lon, area_ha, plantingDate: fieldData.plantingDate || null, crop_type: "Padi" }

            const weather = await getWeatherSummary(lat, lon)
            const soil = await getSoilSummary(lat, lon)
            const rainfallArr = await getLast30DaysRainfall(lat, lon)

            const rainfall30d = rainfallArr?.length > 0
                ? {
                    total_mm: Number(rainfallArr.reduce((a, b) => a + b, 0)).toFixed(1),
                    avg_mm: Number(rainfallArr.reduce((a, b) => a + b, 0) / rainfallArr.length).toFixed(1),
                }
                : null

            const finalField = { ...newField, ...(weather ?? {}), ...(soil ?? {}), rainfall30d, polygonPoints: points }
            setFields(prev => [...(prev ?? []), finalField])
            setFinishedPolygons(prev => [...prev, points])
            setDrawPoints([])
            setFieldForm({ name: '', plantingDate: '' })
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
            <Box className="min-h-screen bg-gray-100">
                {/* Header */}
                <Box className="bg-green-700 px-6 py-4 flex items-center justify-between shadow-md">
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <Box className="bg-white rounded-lg p-1.5">
                            <LayersIcon className="text-green-700 text-2xl" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} className="text-white leading-tight tracking-wider">HARVEY</Typography>
                            <Typography variant="caption" className="text-green-200 tracking-wide">Pantau Risiko Lahan</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button
                            component={Link}
                            to="/dashboard"
                            startIcon={<DashboardIcon />}
                            variant="contained"
                            size="small"
                        >
                            Dashboard
                        </Button>
                    </Stack>
                </Box>

                {/* Main content */}
                <Box className="p-6">
                    <Box className="flex gap-6 items-start">
                        {/* Map */}
                        <Box className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                            <MapContainer center={center} zoom={zoom} style={{ height: 560, width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapUpdater center={center} zoom={zoom} />
                                <MapClicker onClick={latlng => setDrawPoints(p => [...p, latlng])} />

                                {finishedPolygons.map((pts, i) => (
                                    <Polygon key={i} positions={pts}
                                        pathOptions={{ color: '#2e7d32', weight: 2, fillColor: '#2e7d32', fillOpacity: 0.12 }}
                                    />
                                ))}

                                {drawPoints.length > 0 && (
                                    <>
                                        <Polyline positions={drawPoints} pathOptions={{ color: '#4caf50', weight: 2.5, dashArray: '6 4' }} />
                                        {drawPoints.map((p, i) => (
                                            <CircleMarker key={i} center={p}
                                                radius={i === 0 ? 8 : 5}
                                                pathOptions={{
                                                    color: '#2e7d32',
                                                    fillColor: i === 0 ? '#2e7d32' : '#ffffff',
                                                    fillOpacity: 1, weight: 2,
                                                }}
                                            />
                                        ))}
                                        {drawPoints.length >= 2 && (
                                            <Polyline positions={[drawPoints[drawPoints.length - 1], drawPoints[0]]}
                                                pathOptions={{ color: '#4caf50', weight: 1.5, dashArray: '4 4', opacity: 0.6 }}
                                            />
                                        )}
                                    </>
                                )}
                            </MapContainer>

                            {/* Controls — outside MapContainer so Leaflet panes don't cover them */}
                            <Box className="absolute bottom-3 right-3 z-[600]">
                                <Button
                                    startIcon={<MyLocationIcon />}
                                    onClick={async () => {
                                        try {
                                            const loc = await getBrowserLocation()
                                            setCenter([loc.lat, loc.lon])
                                            setZoom(16)
                                        } catch (e) {
                                            console.error(e)
                                        }
                                    }}
                                    size="small"
                                    variant="contained"
                                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                >
                                    Lokasi Saya
                                </Button>
                            </Box>

                            <Box className="absolute top-3 right-3 z-[600] flex gap-2">
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
                                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
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
                                <Box className="absolute bottom-3 left-3 z-50">
                                    <Chip
                                        label={`${drawPoints.length} titik${drawPoints.length < 3 ? ` (min ${3 - drawPoints.length} lagi)` : ''}`}
                                        size="small"
                                        className="bg-white font-semibold shadow"
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Sidebar */}
                        <Box className="w-96 flex-shrink-0">
                            {loading ? (
                                <Paper elevation={0} className="p-6 text-center border border-gray-200 rounded-2xl">
                                    <CircularProgress size={36} className="mb-3 text-green-700" />
                                    <Typography variant="body2" color="text.secondary">Memuat data…</Typography>
                                </Paper>
                            ) : (
                                <FieldPanel fields={fields} onEdit={handleEditOpen} />
                            )}
                            {fields.length === 0 && !loading && (
                                <Box className="mt-3 p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center">
                                    <TerrainIcon className="text-gray-300 text-4xl mb-2" />
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
                    onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                        severity={snackbar.severity} variant="filled" className="rounded-xl">
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* Save field modal */}
                <Dialog open={showFieldModal} onClose={handleModalClose} maxWidth="xs" fullWidth>
                    <DialogTitle fontWeight={700}>Simpan Lahan</DialogTitle>
                    <DialogContent>
                        <DialogContentText className="">Lengkapi info lahan sebelum menyimpan.</DialogContentText>
                        <Box className="h-2"></Box>
                        <Stack spacing={2} mt={1}>
                            <TextField
                                inputRef={nameInputRef}
                                label="Nama Lahan"
                                value={fieldForm.name}
                                onChange={e => setFieldForm(f => ({ ...f, name: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && handleModalConfirm()}
                                fullWidth size="small"
                            />
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel shrink htmlFor="planting-date">Tanggal Tanam</InputLabel>
                                <OutlinedInput
                                    id="planting-date"
                                    type="date"
                                    value={fieldForm.plantingDate}
                                    onChange={e => setFieldForm(f => ({ ...f, plantingDate: e.target.value }))}
                                    label="Tanggal Tanam"
                                />
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions className="px-4 pb-3">
                        <Button onClick={handleModalClose} color="inherit" size="small">Batal</Button>
                        <Button onClick={handleModalConfirm} variant="contained" size="small">OK</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit field modal */}
                <Dialog open={!!editField} onClose={() => setEditField(null)} maxWidth="xs" fullWidth>
                    <DialogTitle fontWeight={700}>Edit Lahan</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            <TextField
                                label="Nama Lahan"
                                value={editField?.name ?? ''}
                                onChange={e => setEditField(f => ({ ...f, name: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && handleEditSave()}
                                fullWidth size="small"
                            />
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel shrink htmlFor="edit-planting-date">Tanggal Tanam</InputLabel>
                                <OutlinedInput
                                    id="edit-planting-date"
                                    type="date"
                                    value={editField?.plantingDate ?? ''}
                                    onChange={e => setEditField(f => ({ ...f, plantingDate: e.target.value }))}
                                    label="Tanggal Tanam"
                                />
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions className="px-4 pb-3">
                        <Button onClick={() => setEditField(null)} color="inherit" size="small">Batal</Button>
                        <Button onClick={handleEditSave} variant="contained" size="small">Simpan</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    )
}
