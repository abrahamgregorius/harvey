import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    createTheme, ThemeProvider, CssBaseline,
    Box, Typography, Paper, Stack, Button,
    IconButton, CircularProgress, Chip,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MapIcon from '@mui/icons-material/Map'
import TerrainIcon from '@mui/icons-material/Terrain'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import GrassIcon from '@mui/icons-material/Grass'
import { getFields, deleteField } from '../services/fieldStore.js'

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

function StatCard({ icon, label, value, unit = '', highlight = false }) {
    return (
        <Box sx={{
            flex: 1,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: highlight ? 'primary.main' : 'grey.50',
            color: highlight ? 'white' : 'text.primary',
            minWidth: 0,
        }}>
            <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', opacity: highlight ? 0.9 : 0.6 }}>{icon}</Box>
                    <Typography variant="caption" sx={{ opacity: highlight ? 0.9 : 0.6, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>
                        {label}
                    </Typography>
                </Box>
                <Typography variant="body1" fontWeight={700} sx={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {value ?? '—'}{unit}
                </Typography>
            </Stack>
        </Box>
    )
}

function FieldCard({ field, onDelete }) {
    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {field.name}
                    </Typography>
                    <IconButton size="small" onClick={() => onDelete(field.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <StatCard icon={<TerrainIcon sx={{ fontSize: 14 }} />} label="Luas" value={field.area_ha?.toFixed(2)} unit=" ha" />
                    <StatCard icon={<MapIcon sx={{ fontSize: 14 }} />} label="Elevasi" value={field.elevation} unit=" m" />
                </Stack>

                <Stack direction="row" spacing={1}>
                    <StatCard icon={<WbSunnyIcon sx={{ fontSize: 14 }} />} label="Suhu" value={field.temp?.toFixed(1)} unit="°C" />
                    <StatCard icon={<WaterDropIcon sx={{ fontSize: 14 }} />} label="Humid" value={field.humidity} unit="%" />
                    <StatCard icon={<AirIcon sx={{ fontSize: 14 }} />} label="Angin" value={field.windSpeed?.toFixed(1)} unit=" km/j" />
                </Stack>

                <Stack direction="row" spacing={1}>
                    <StatCard icon={<GrassIcon sx={{ fontSize: 14 }} />} label="Tanah" value={field.soilType} />
                    <StatCard
                        icon={<WaterDropIcon sx={{ fontSize: 14 }} />}
                        label="Hujan 30h"
                        value={field.rainfall30d?.total_mm}
                        unit=" mm"
                        highlight={Number(field.rainfall30d?.total_mm) > 200}
                    />
                </Stack>

                {field.soilParams && (
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        pH {field.soilParams.pH ?? '?'} · N {field.soilParams.nitrogen ?? '?'} · P {field.soilParams.phosphorus ?? '?'} · K {field.soilParams.potassium ?? '?'}
                    </Box>
                )}

                <Typography variant="caption" color="text.disabled">
                    {field.lat?.toFixed(4)}, {field.lon?.toFixed(4)}
                </Typography>
            </Stack>
        </Paper>
    )
}

export default function Dashboard() {
    const [fields, setFields] = useState([])
    const [loading, setLoading] = useState(true)

    async function load() {
        try {
            const data = await getFields()
            setFields(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    async function handleDelete(id) {
        try {
            await deleteField(id)
            setFields(prev => prev.filter(f => f.id !== id))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Box sx={{ bgcolor: 'primary.main', px: 3, py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                            component={Link}
                            to="/"
                            startIcon={<ArrowBackIcon />}
                            sx={{ color: 'white' }}
                        >
                            Peta
                        </Button>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'white', flex: 1 }}>
                            Dashboard Lahan
                        </Typography>
                        <Chip
                            label={`${fields.length} lahan`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                    </Stack>
                </Box>

                <Box sx={{ p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : fields.length === 0 ? (
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <MapIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                            <Typography color="text.secondary">
                                Belum ada lahan. Gambar polygon di halaman peta.
                            </Typography>
                            <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                                Ke Peta
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {fields.map(f => (
                                <Grid item xs={12} sm={6} md={4} key={f.id}>
                                    <FieldCard field={f} onDelete={handleDelete} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    )
}
