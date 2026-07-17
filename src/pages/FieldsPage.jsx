import { useState } from 'react'
import { Stack, Box, Typography, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, OutlinedInput, Collapse } from '@mui/material'
import MapAltIcon from '@mui/icons-material/Map'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import GrassIcon from '@mui/icons-material/Grass'
import TerrainIcon from '@mui/icons-material/Terrain'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getGrowthStage } from '../utils/growthUtils'
import { updateField } from '../services/fieldStore.js'

export { getGrowthStage }

export function FieldsPage({ fields, onDelete, onUpdate }) {
    const [editField, setEditField] = useState(null)
    const [expandedId, setExpandedId] = useState(null)

    const handleEditOpen = (field, e) => {
        e.stopPropagation()
        setEditField({ ...field })
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        onDelete(id)
    }

    const handleEditSave = async () => {
        if (!editField?.name?.trim()) return
        try {
            const updated = await updateField(editField.id, editField)
            onUpdate(updated)
            setEditField(null)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Daftar Lahan</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {fields.length} lahan · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </Typography>
                </Box>
                <Button component={Link} to="/app" variant="contained" size="small" startIcon={<MapAltIcon />}>
                    Tambah Lahan
                </Button>
            </Box>

            <Paper sx={{ bgcolor: 'background.paper', border: '1px solid', margin: 2, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                {fields.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <MapAltIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">Belum ada lahan.</Typography>
                        <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>Buat di Peta</Button>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Stack spacing={0}>
                            <Stack direction="row" sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <Box sx={{ width: 32 }} />
                                {['Nama', 'Luas', 'Suhu', 'Humid', 'Angin', 'Tanam', 'Tahap', 'Edit', 'Hapus'].map(h => (
                                    <Typography key={h} variant="caption" fontWeight={700} sx={{ flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                        {h}
                                    </Typography>
                                ))}
                            </Stack>
                            {fields.map(f => {
                                const g = getGrowthStage(f.plantingDate)
                                const isExpanded = expandedId === f.id
                                return (
                                    <Box key={f.id}>
                                        <Stack direction="row" alignItems="center"
                                            onClick={() => setExpandedId(isExpanded ? null : f.id)}
                                            sx={{
                                                px: 2.5, py: 1.5,
                                                borderBottom: isExpanded ? '1px solid' : 'none',
                                                borderColor: 'divider',
                                                bgcolor: isExpanded ? 'rgba(46,125,50,0.04)' : 'transparent',
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: isExpanded ? 'rgba(46,125,50,0.06)' : 'rgba(255,255,255,0.02)' },
                                                '&:last-child': { borderBottom: isExpanded ? '1px solid' : 'none', borderColor: 'divider' },
                                            }}
                                        >
                                            <Box sx={{ width: 32, display: 'flex', color: 'text.secondary' }}>
                                                <ExpandMoreIcon sx={{
                                                    fontSize: 18,
                                                    transition: 'transform 0.2s',
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>{f.name}</Typography>
                                            <Typography variant="body2" sx={{ flex: 1 }}>{f.area_ha?.toFixed(2)} ha</Typography>
                                            <Typography variant="body2" sx={{ flex: 1 }}>{f.temp?.toFixed(1)}°C</Typography>
                                            <Typography variant="body2" sx={{ flex: 1 }}>{f.humidity}%</Typography>
                                            <Typography variant="body2" sx={{ flex: 1 }}>{f.windSpeed?.toFixed(1)} km/j</Typography>
                                            <Typography variant="body2" sx={{ flex: 1 }}>{f.plantingDate ?? '—'}</Typography>
                                            <Box sx={{ flex: 1 }}>
                                                {g && (
                                                    <Box sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: `${g.color}20`, display: 'inline-block' }}>
                                                        <Typography variant="caption" fontWeight={700} sx={{ color: g.color }}>{g.stage}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <IconButton size="small" onClick={(e) => handleEditOpen(f, e)} sx={{ color: 'primary.main', flex: 1 }}>
                                                <EditIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={(e) => handleDelete(f.id, e)} sx={{ color: 'error.main', flex: 1 }}>
                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Stack>

                                        {/* Expanded detail panel */}
                                        <Collapse in={isExpanded} timeout="auto">
                                            <Box sx={{ display: 'flex', gap: 2, p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                                                <Box sx={{ width: 220, height: 160, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: 'grey.100' }}>
                                                    <MapContainer
                                                        center={[f.lat ?? -6.2, f.lon ?? 106.8]}
                                                        zoom={14}
                                                        style={{ width: '100%', height: '100%' }}
                                                        zoomControl={false}
                                                        dragging={false}
                                                        scrollWheelZoom={false}
                                                    >
                                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                        {f.polygonPoints?.length > 2
                                                            ? <Polygon positions={f.polygonPoints} color="#2e7d32" />
                                                            : <CircleMarker center={[f.lat, f.lon]} radius={8} pathOptions={{ color: '#2e7d32', fillColor: '#2e7d32' }} />
                                                        }
                                                    </MapContainer>
                                                </Box>
                                                <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                                                    <StatRow icon={<TerrainIcon sx={{ fontSize: 13 }} />} label="Luas" value={f.area_ha?.toFixed(2)} unit=" ha" />
                                                    <StatRow icon={<LocationOnIcon sx={{ fontSize: 13 }} />} label="Koordinat" value={f.lat != null ? `${f.lat?.toFixed(4)}, ${f.lon?.toFixed(4)}` : '—'} />
                                                    <StatRow icon={<WbSunnyIcon sx={{ fontSize: 13 }} />} label="Suhu" value={f.temp?.toFixed(1)} unit="°C" />
                                                    <StatRow icon={<WaterDropIcon sx={{ fontSize: 13 }} />} label="Humid" value={f.humidity} unit="%" />
                                                    <StatRow icon={<AirIcon sx={{ fontSize: 13 }} />} label="Angin" value={f.windSpeed?.toFixed(1)} unit=" km/j" />
                                                    <StatRow icon={<GrassIcon sx={{ fontSize: 13 }} />} label="Tanah" value={f.soilType ?? '—'} />
                                                    {f.clay_pct != null && (
                                                        <StatRow icon={<GrassIcon sx={{ fontSize: 13 }} />} label="Clay/Sand/Silt" value={`${f.clay_pct}/${f.sand_pct}/${f.silt_pct}`} unit="%" />
                                                    )}
                                                    <StatRow icon={<CalendarMonthIcon sx={{ fontSize: 13 }} />} label="Tanam" value={f.plantingDate ?? '—'} />
                                                    {f.rainfall30d?.avg_mm != null && (
                                                        <StatRow icon={<WaterDropIcon sx={{ fontSize: 13 }} />} label="Hujan/hr" value={Number(f.rainfall30d.avg_mm).toFixed(1)} unit=" mm" />
                                                    )}
                                                    {f.elevation != null && (
                                                        <StatRow icon={<TerrainIcon sx={{ fontSize: 13 }} />} label="Elevasi" value={f.elevation} unit=" m" />
                                                    )}
                                                    {f.description && (
                                                        <Box sx={{ gridColumn: '1/-1' }}>
                                                            <Typography variant="caption" color="text.secondary">{f.description}</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </Box>
                )}
            </Paper>

            {/* Edit modal */}
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
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEditField(null)} color="inherit" size="small">Batal</Button>
                    <Button onClick={handleEditSave} variant="contained" size="small">Simpan</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

function StatRow({ icon, label, value, unit }) {
    return (
        <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                    {value ?? '—'}{unit && <Typography component="span" variant="caption" color="text.secondary"> {unit}</Typography>}
                </Typography>
            </Box>
        </Stack>
    )
}
