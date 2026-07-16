import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    createTheme, ThemeProvider, CssBaseline,
    Box, Typography, Stack, Button,
    IconButton, CircularProgress, Paper,
} from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MapAltIcon from '@mui/icons-material/Map'
import ListIcon from '@mui/icons-material/List'
import BarChartIcon from '@mui/icons-material/BarChart'
import TerrainIcon from '@mui/icons-material/Terrain'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import GrassIcon from '@mui/icons-material/Grass'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WaterIcon from '@mui/icons-material/WaterDrop'
import RankIcon from '@mui/icons-material/Leaderboard'
import { getFields, deleteField } from '../services/fieldStore.js'

const theme = createTheme({
    palette: {
        primary: { main: '#2e7d32' },
        background: { default: '#f5f5f5', paper: '#ffffff' },
        text: { primary: '#1a1a2e', secondary: '#6b7280' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
    },
    shape: { borderRadius: 10 },
    components: {
        MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } } },
    },
})

const SIDEBAR_W = 240

function getGrowthStage(plantingDate) {
    if (!plantingDate) return { stage: 'Belum Tanam', color: '#64748b', days: 0 }
    const days = Math.floor((Date.now() - new Date(plantingDate)) / 86400000)
    if (days < 0) return { stage: 'Belum Tanam', color: '#64748b', days }
    if (days < 30) return { stage: 'Vegetatif', color: '#4ade80', days }
    if (days < 60) return { stage: 'Generatif', color: '#38bdf8', days }
    if (days < 90) return { stage: 'Pra-Panen', color: '#fb923c', days }
    return { stage: 'Panen', color: '#f87171', days }
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage }) {
    const nav = [
        { key: 'home', icon: <DashboardIcon />, label: 'Home' },
        { key: 'fields', icon: <ListIcon />, label: 'Daftar Lahan' },
        { key: 'water', icon: <RankIcon />, label: 'Alokasi Air' },
        { key: 'analytics', icon: <BarChartIcon />, label: 'Analisis' },
    ]
    return (
        <Box sx={{
            width: SIDEBAR_W,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
        }}>
            {/* Brand */}
            <Box sx={{ px: 2.5, py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{
                        bgcolor: 'primary.main',
                        borderRadius: 1.5,
                        p: 0.8,
                        display: 'flex',
                    }}>
                        <LayersIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.1, letterSpacing: 1 }}>
                            HARVEY
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Smart Field Monitor
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Nav */}
            <Box sx={{ px: 1.5, py: 2, flex: 1 }}>
                <Stack spacing={0.5}>
                    {nav.map(n => (
                        <Button
                            key={n.key}
                            onClick={() => setPage(n.key)}
                            startIcon={
                                <Box sx={{
                                    color: page === n.key ? 'primary.main' : 'text.secondary',
                                    display: 'flex',
                                    '& svg': { fontSize: 20 }
                                }}>
                                    {n.icon}
                                </Box>
                            }
                            sx={{
                                justifyContent: 'flex-start',
                                px: 2, py: 1,
                                borderRadius: 1.5,
                                color: page === n.key ? 'primary.main' : 'text.secondary',
                                bgcolor: page === n.key ? 'rgba(46,125,50,0.1)' : 'transparent',
                                fontWeight: page === n.key ? 700 : 500,
                                fontSize: '0.875rem',
                                textTransform: 'none',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                            }}
                        >
                            {n.label}
                        </Button>
                    ))}
                </Stack>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 1.5, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    component={Link}
                    to="/"
                    startIcon={<MapAltIcon sx={{ fontSize: 20 }} />}
                    sx={{
                        justifyContent: 'flex-start',
                        px: 2, py: 1,
                        borderRadius: 1.5,
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                        width: '100%',
                    }}
                >
                    Buka Peta
                </Button>
            </Box>
        </Box>
    )
}

// ── Metric tile ──────────────────────────────────────────────────────────────
function MetricTile({ icon, label, value, unit, trend }) {
    return (
        <Paper sx={{
            p: 2.5,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            minHeight: 110,
        }}>
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{
                        bgcolor: 'rgba(46,125,50,0.1)',
                        borderRadius: 1.5,
                        p: 1,
                        color: 'primary.main',
                        display: 'flex',
                    }}>
                        {icon}
                    </Box>
                    {trend != null && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: trend >= 0 ? 'primary.main' : 'error.main',
                            bgcolor: trend >= 0 ? 'rgba(46,125,50,0.1)' : 'rgba(211,47,47,0.1)',
                            borderRadius: 1,
                            px: 0.75,
                            py: 0.25,
                        }}>
                            <TrendingUpIcon sx={{ fontSize: 14, transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
                            <Typography variant="caption" fontWeight={700}>
                                {Math.abs(trend)}%
                            </Typography>
                        </Box>
                    )}
                </Stack>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1 }}>
                        {value ?? '—'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {unit}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Stack>
        </Paper>
    )
}

// ── Growth stage card ────────────────────────────────────────────────────────
function GrowthCard({ fields }) {
    const stages = ['Vegetatif', 'Generatif', 'Pra-Panen', 'Panen']
    const colors = { Vegetatif: '#4ade80', Generatif: '#38bdf8', 'Pra-Panen': '#fb923c', Panen: '#f87171' }
    const counts = {}
    stages.forEach(s => { counts[s] = 0 })
    fields.forEach(f => {
        const g = getGrowthStage(f.plantingDate)
        if (g) counts[g.stage]++
    })
    const total = fields.filter(f => f.plantingDate).length

    return (
        <Paper sx={{ p: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Tahap Pertumbuhan
                </Typography>
                <Stack spacing={1.5}>
                    {stages.map(stage => (
                        <Box key={stage}>
                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors[stage] }} />
                                    <Typography variant="body2" fontWeight={500}>{stage}</Typography>
                                </Stack>
                                <Typography variant="body2" fontWeight={700} sx={{ color: colors[stage] }}>
                                    &nbsp; {counts[stage]} <Typography component="span" variant="caption" color="text.secondary">/ {total}</Typography>
                                </Typography>
                            </Stack>
                            <Box sx={{ height: 4, bgcolor: 'grey.100', borderRadius: 2 }}>
                                <Box sx={{
                                    height: '100%',
                                    width: total > 0 ? `${(counts[stage] / total) * 100}%` : '0%',
                                    bgcolor: colors[stage],
                                    borderRadius: 2,
                                    transition: 'width 0.6s ease',
                                }} />
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Paper>
    )
}

// ── Field list item ──────────────────────────────────────────────────────────
function FieldItem({ field, onDelete }) {
    const g = getGrowthStage(field.plantingDate)
    return (
        <Box sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 0 },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
        }}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{
                            width: 10, height: 10, borderRadius: '50%',
                            bgcolor: g?.color ?? '#64748b',
                            border: '2px solid',
                            borderColor: g?.color ?? '#64748b',
                            opacity: 0.3,
                        }} />
                        <Typography variant="subtitle2" fontWeight={700}>{field.name}</Typography>
                    </Stack>
                    <IconButton size="small" onClick={() => onDelete(field.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <TerrainIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{field.area_ha?.toFixed(2)} ha</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <WbSunnyIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{field.temp?.toFixed(1)}°C</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <WaterDropIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{field.humidity}%</Typography>
                    </Stack>
                    {g && (
                        <Box sx={{
                            px: 1, py: 0.25,
                            borderRadius: 1,
                            bgcolor: `${g.color}20`,
                        }}>
                            <Typography variant="caption" fontWeight={700} sx={{ color: g.color }}>
                                {g.stage} · {g.days}h
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}

// ── Home page ────────────────────────────────────────────────────────────────
function HomePage({ fields, onDelete }) {
    const totalArea = fields.reduce((s, f) => s + (f.area_ha || 0), 0)
    const avgTemp = fields.filter(f => f.temp).length
        ? (fields.reduce((s, f) => s + (f.temp || 0), 0) / fields.filter(f => f.temp).length).toFixed(1)
        : null
    const avgHumid = fields.filter(f => f.humidity).length
        ? Math.round(fields.reduce((s, f) => s + (f.humidity || 0), 0) / fields.filter(f => f.humidity).length)
        : null
    const planted = fields.filter(f => f.plantingDate).length
    const soilTypes = [...new Set(fields.map(f => f.soilType).filter(Boolean))].length

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary' }}>
                    Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Pantau semua lahan pertanian kamu di satu tempat.
                </Typography>
            </Box>

            {/* Metrics — full-width CSS grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 1,
                px: 2, py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}>
                <MetricTile icon={<LayersIcon />} label="Total Lahan" value={fields.length} unit="lahan" />
                <MetricTile icon={<TerrainIcon />} label="Luas Total" value={totalArea.toFixed(1)} unit="hektar" />
                <MetricTile icon={<CalendarMonthIcon />} label="Sudah Tanam" value={planted} unit={`dari ${fields.length}`} />
                <MetricTile icon={<GrassIcon />} label="Jenis Tanah" value={soilTypes} unit="jenis" />
            </Box>

            {/* Weather + Growth — flex row, full width */}
            <Box sx={{ display: 'flex', flex: 1, minHeight: 0, gap: 2, p: 2 }}>
                <Paper sx={{
                    flex: 1,
                    bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2,
                    display: 'flex', flexDirection: 'column', gap: 2, p: 2.5, overflow: 'hidden',
                }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Cuaca Rata-rata
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <WbSunnyIcon sx={{ fontSize: 28, color: '#fb923c' }} />
                            <Box>
                                <Typography variant="h4" fontWeight={800}>{avgTemp ?? '—'}°C</Typography>
                                <Typography variant="caption" color="text.secondary">Suhu</Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={3}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>{avgHumid ?? '—'}%</Typography>
                                <Typography variant="caption" color="text.secondary">Humid</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>{fields[0]?.rainfall30d?.avg_mm ?? '—'} mm</Typography>
                                <Typography variant="caption" color="text.secondary">Hujan/hr</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
                <Box sx={{ flex: 2 }}>
                    <GrowthCard fields={fields} />
                </Box>
            </Box>

            {/* Field list */}
            <Paper sx={{
                mx: 2, mb: 2,
                bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden',
                flex: 1, display: 'flex', flexDirection: 'column',
                minHeight: 0,
            }}>
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Lahan Terbaru
                    </Typography>
                </Box>
                {fields.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Belum ada lahan.</Typography>
                        <Button component={Link} to="/" variant="outlined" size="small" sx={{ mt: 2 }}>
                            Buat di Peta
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ overflow: 'auto', flex: 1 }}>
                        {[...fields].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(f => (
                            <FieldItem key={f.id} field={f} onDelete={onDelete} />
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    )
}

// ── Fields table page ─────────────────────────────────────────────────────────
function FieldsPage({ fields, onDelete }) {
    return (
        <Stack spacing={3} sx={{ p: 2 }}>
            <Box>
                <Typography variant="h5" fontWeight={800}>Daftar Lahan</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {fields.length} lahan terdaftar
                </Typography>
            </Box>

            <Paper sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                {fields.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <MapAltIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">Belum ada lahan.</Typography>
                        <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>Buat di Peta</Button>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Stack spacing={0}>
                            {/* Table header */}
                            <Stack direction="row" sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}>
                                {['Nama', 'Luas', 'Suhu', 'Humid', 'Angin', 'Tanam', 'Tahap', ''].map(h => (
                                    <Typography key={h} variant="caption" fontWeight={700} sx={{ flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                        {h}
                                    </Typography>
                                ))}
                            </Stack>
                            {fields.map(f => {
                                const g = getGrowthStage(f.plantingDate)
                                return (
                                    <Stack key={f.id} direction="row" alignItems="center"
                                        sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, '&:last-child': { borderBottom: 0 } }}
                                    >
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
                                        <IconButton size="small" onClick={() => onDelete(f.id)} sx={{ color: 'error.main', flex: 1 }}>
                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </Box>
                )}
            </Paper>
        </Stack>
    )
}

// ── Risk score helpers ────────────────────────────────────────────────────────
function calcRiskScore(f) {
    // 1. Water Scarcity (0–1): low rainfall + high temp → high scarcity
    const rainfall = f.rainfall30d?.total_mm ?? 0
    const temp = f.temp ?? 25
    const scarcity = Math.min(1, Math.max(0, (1 - rainfall / 120) * (temp / 40)))

    // 2. Soil Drainage Risk (0–1): sandy soil = fast drainage = higher risk
    const sand = f.sand_pct ?? 30
    const soilRisk = Math.min(1, sand / 100)

    // 3. Growth Stage Water Demand (0–1): active growth = more needed
    const g = getGrowthStage(f.plantingDate)
    const stageScore = { 'Vegetatif': 1.0, 'Generatif': 1.0, 'Pra-Panen': 0.5, 'Panen': 0.1, 'Belum Tanam': 0.05 }
    const growthScore = stageScore[g?.stage] ?? 0.05

    // 4. Evapotranspiration (0–1): high temp + low humidity + wind = high ET
    const humidity = f.humidity ?? 70
    const wind = f.windSpeed ?? 5
    const et = Math.min(1, (temp / 40) * (1 - humidity / 100) * (wind / 20))

    // Weighted composite → 0–100
    return Math.round((scarcity * 0.40 + soilRisk * 0.20 + growthScore * 0.25 + et * 0.15) * 100)
}

function calcWaterAllocation(fields) {
    const TOTAL_WATER_L = 50000
    const ranked = fields.map(f => ({ ...f, riskScore: calcRiskScore(f) }))
    ranked.sort((a, b) => b.riskScore - a.riskScore)
    ranked.forEach((f, i) => { f.rank = i + 1 })

    const totalRisk = ranked.reduce((s, f) => s + f.riskScore, 0) || 1
    ranked.forEach(f => {
        // ponytail: simple proportional allocation, min 2000L floor
        f.waterAlloc_L = Math.max(2000, Math.round((f.riskScore / totalRisk) * TOTAL_WATER_L))
    })
    return ranked
}

function riskColor(score) {
    if (score >= 70) return '#ef4444'
    if (score >= 50) return '#f97316'
    if (score >= 30) return '#eab308'
    return '#22c55e'
}

function riskLabel(score) {
    if (score >= 70) return 'Sangat Tinggi'
    if (score >= 50) return 'Tinggi'
    if (score >= 30) return 'Sedang'
    return 'Rendah'
}

// ── Water Allocation page ────────────────────────────────────────────────────
function WaterAllocationPage({ fields }) {
    const ranked = calcWaterAllocation(fields)
    const totalWater = ranked.reduce((s, f) => s + f.waterAlloc_L, 0)

    if (fields.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" height="100%" spacing={2}>
                <WaterIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                <Typography color="text.secondary">Belum ada data lahan.</Typography>
                <Button component={Link} to="/" variant="outlined" size="small" sx={{ mt: 1 }}>
                    Buat Lahan di Peta
                </Button>
            </Stack>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="h5" fontWeight={800}>Alokasi Air berdasarkan Skor Risiko</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Peringkat prioritasi irigasi untuk {fields.length} lahan · Total {totalWater.toLocaleString('id-ID')} L tersedia
                </Typography>
            </Box>

            {/* Legend */}
            <Box sx={{ px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {[
                    { color: '#ef4444', label: 'Sangat Tinggi (≥70)' },
                    { color: '#f97316', label: 'Tinggi (50–69)' },
                    { color: '#eab308', label: 'Sedang (30–49)' },
                    { color: '#22c55e', label: 'Rendah (<30)' },
                ].map(l => (
                    <Stack key={l.label} direction="row" spacing={0.75} alignItems="center">
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color }} />
                        <Typography variant="caption" color="text.secondary">{l.label}</Typography>
                    </Stack>
                ))}
            </Box>

            {/* Ranking table */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={0}>
                    {/* Header */}
                    <Stack direction="row" sx={{ px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
                        {['#', 'Lahan', 'Skor Risiko', 'Kebutuhan Air', 'Luas', 'Tahap', 'Faktor Utama'].map(h => (
                            <Typography key={h} variant="caption" fontWeight={700} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, flex: h === 'Lahan' ? 2 : 1 }}>
                                {h}
                            </Typography>
                        ))}
                    </Stack>

                    {ranked.map((f, idx) => {
                        const g = getGrowthStage(f.plantingDate)
                        const color = riskColor(f.riskScore)
                        const factors = []
                        if ((f.rainfall30d?.total_mm ?? 0) < 50) factors.push('Hujan rendah')
                        if ((f.temp ?? 0) > 30) factors.push('Suhu tinggi')
                        if ((f.sand_pct ?? 0) > 40) factors.push('Tanah berpasir')
                        if (['Vegetatif', 'Generatif'].includes(g?.stage)) factors.push('Fase aktif')
                        if ((f.windSpeed ?? 0) > 10) factors.push('Angin kencang')
                        const factorStr = factors.length > 0 ? factors.slice(0, 2).join(', ') : '—'

                        return (
                            <Box key={f.id} sx={{
                                px: 3, py: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
                                '&:hover': { bgcolor: 'rgba(46,125,50,0.04)' },
                            }}>
                                <Stack direction="row" alignItems="center">
                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            bgcolor: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c2f' : 'grey.200',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mr: 1.5,
                                        }}>
                                            <Typography variant="caption" fontWeight={800} sx={{ color: idx < 3 ? 'white' : 'text.secondary', fontSize: 11 }}>
                                                {f.rank}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" fontWeight={600} sx={{ flex: 2 }}>{f.name}</Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                                            <Typography variant="body2" fontWeight={700} sx={{ color }}>{f.riskScore}</Typography>
                                            <Typography variant="caption" color="text.secondary">/100</Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{ color, fontSize: 10 }}>{riskLabel(f.riskScore)}</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={700} sx={{ color: '#2563eb' }}>
                                            {f.waterAlloc_L.toLocaleString('id-ID')} L
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {((f.waterAlloc_L / f.area_ha) || 0).toFixed(0)} L/ha
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ flex: 1 }}>{f.area_ha?.toFixed(2)} ha</Typography>
                                    <Box sx={{ flex: 1 }}>
                                        {g && (
                                            <Box sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: `${g.color}20`, display: 'inline-block' }}>
                                                <Typography variant="caption" fontWeight={700} sx={{ color: g.color }}>{g.stage}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>{factorStr}</Typography>
                                </Stack>
                            </Box>
                        )
                    })}
                </Stack>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Stack direction="row" spacing={4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <WaterIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                        <Typography variant="body2" fontWeight={600}>Total dialokasikan</Typography>
                        <Typography variant="body2" color="text.secondary">{totalWater.toLocaleString('id-ID')} L</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        Metode: proporsional skor risiko · minimum 2.000 L/lahan
                    </Typography>
                </Stack>
            </Box>
        </Box>
    )
}

// ── Dashboard layout ─────────────────────────────────────────────────────────
export default function Dashboard() {
    const [fields, setFields] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState('home')

    useEffect(() => {
        getFields().then(data => { setFields(data) }).catch(console.error).finally(() => setLoading(false))
    }, [])

    async function handleDelete(id) {
        try {
            await deleteField(id)
            setFields(prev => prev.filter(f => f.id !== id))
        } catch (e) { console.error(e) }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.default' }}>
                <Sidebar page={page} setPage={setPage} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {/* Topbar */}
                    <Box sx={{
                        px: 3, py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexShrink: 0,
                    }}>
                        <Typography variant="h6" fontWeight={700}>
                            {page === 'home' ? 'Home' : page === 'fields' ? 'Daftar Lahan' : page === 'water' ? 'Alokasi Air' : 'Analisis'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {fields.length} lahan · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress sx={{ color: 'primary.main' }} />
                            </Box>
                        ) : page === 'home' ? (
                            <HomePage fields={fields} onDelete={handleDelete} />
                        ) : page === 'fields' ? (
                            <FieldsPage fields={fields} onDelete={handleDelete} />
                        ) : page === 'water' ? (
                            <WaterAllocationPage fields={fields} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" height="100%" spacing={2}>
                                <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                                <Typography color="text.secondary">Analisis dalam pengembangan.</Typography>
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
