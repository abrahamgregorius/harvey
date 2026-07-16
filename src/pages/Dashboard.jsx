import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    createTheme, ThemeProvider, CssBaseline,
    Box, Typography, Stack, Button,
    CircularProgress,
} from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MapAltIcon from '@mui/icons-material/Map'
import ListIcon from '@mui/icons-material/List'
import BarChartIcon from '@mui/icons-material/BarChart'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { getFields, deleteField } from '../services/fieldStore.js'
import { HomePage } from './HomePage.jsx'
import { FieldsPage } from './FieldsPage.jsx'
import { WaterAllocationPage } from './WaterAllocationPage.jsx'
import { AnalyticsPage } from './AnalyticsPage.jsx'

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

const NAV = [
    { key: 'home', icon: <DashboardIcon />, label: 'Home' },
    { key: 'fields', icon: <ListIcon />, label: 'Daftar Lahan' },
    { key: 'water', icon: <LeaderboardIcon />, label: 'Alokasi Air' },
    { key: 'analytics', icon: <BarChartIcon />, label: 'Analisis' },
]

const PAGE_TITLES = {
    home: 'Home',
    fields: 'Daftar Lahan',
    water: 'Alokasi Air',
    analytics: 'Analisis',
}

function Sidebar({ page, setPage }) {
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

            <Box sx={{ px: 1.5, py: 2, flex: 1 }}>
                <Stack spacing={0.5}>
                    {NAV.map(n => (
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

    function handleUpdate(updated) {
        setFields(prev => prev.map(f => f.id === updated.id ? updated : f))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.default' }}>
                <Sidebar page={page} setPage={setPage} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{
                        px: 3, py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexShrink: 0,
                    }}>
                        <Typography variant="h6" fontWeight={700}>
                            {PAGE_TITLES[page] ?? 'Dashboard'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {fields.length} lahan · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress sx={{ color: 'primary.main' }} />
                            </Box>
                        ) : page === 'home' ? (
                            <HomePage fields={fields} onDelete={handleDelete} />
                        ) : page === 'fields' ? (
                            <FieldsPage fields={fields} onDelete={handleDelete} onUpdate={handleUpdate} />
                        ) : page === 'water' ? (
                            <WaterAllocationPage fields={fields} />
                        ) : page === 'analytics' ? (
                            <AnalyticsPage />
                        ) : null}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
