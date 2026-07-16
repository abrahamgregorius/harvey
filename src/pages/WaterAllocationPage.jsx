import { Stack, Box, Typography, Button } from '@mui/material'
import WaterIcon from '@mui/icons-material/WaterDrop'
import { Link } from 'react-router-dom'
import { getGrowthStage } from '../utils/growthUtils'

export { getGrowthStage }

export function calcRiskScore(f) {
    const rainfall = f.rainfall30d?.total_mm ?? 0
    const temp = f.temp ?? 25
    const scarcity = Math.min(1, Math.max(0, (1 - rainfall / 120) * (temp / 40)))

    const sand = f.sand_pct ?? 30
    const soilRisk = Math.min(1, sand / 100)

    const g = getGrowthStage(f.plantingDate)
    const stageScore = { 'Vegetatif': 1.0, 'Generatif': 1.0, 'Pra-Panen': 0.5, 'Panen': 0.1, 'Belum Tanam': 0.05 }
    const growthScore = stageScore[g?.stage] ?? 0.05

    const humidity = f.humidity ?? 70
    const wind = f.windSpeed ?? 5
    const et = Math.min(1, (temp / 40) * (1 - humidity / 100) * (wind / 20))

    return Math.round((scarcity * 0.40 + soilRisk * 0.20 + growthScore * 0.25 + et * 0.15) * 100)
}

export function calcWaterAllocation(fields) {
    const TOTAL_WATER_L = 50000
    const ranked = fields.map(f => ({ ...f, riskScore: calcRiskScore(f) }))
    ranked.sort((a, b) => b.riskScore - a.riskScore)
    ranked.forEach((f, i) => { f.rank = i + 1 })

    const totalRisk = ranked.reduce((s, f) => s + f.riskScore, 0) || 1
    ranked.forEach(f => {
        f.waterAlloc_L = Math.max(2000, Math.round((f.riskScore / totalRisk) * TOTAL_WATER_L))
    })
    return ranked
}

export function riskColor(score) {
    if (score >= 70) return '#ef4444'
    if (score >= 50) return '#f97316'
    if (score >= 30) return '#eab308'
    return '#22c55e'
}

export function riskLabel(score) {
    if (score >= 70) return 'Sangat Tinggi'
    if (score >= 50) return 'Tinggi'
    if (score >= 30) return 'Sedang'
    return 'Rendah'
}

export function WaterAllocationPage({ fields }) {
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
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="h5" fontWeight={800}>Alokasi Air berdasarkan Skor Risiko</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Peringkat prioritasi irigasi untuk {fields.length} lahan · Total {totalWater.toLocaleString('id-ID')} L tersedia
                </Typography>
            </Box>

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

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack spacing={0}>
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
