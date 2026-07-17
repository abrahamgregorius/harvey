import { Box, Typography, Stack, Paper } from '@mui/material'

const DAYS_TO_SHOW = 14

function RainBar({ mm, maxMm, color }) {
    const height = maxMm > 0 ? Math.max(2, (mm / maxMm) * 48) : 2
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary' }}>
                {mm > 0 ? mm.toFixed(1) : ''}
            </Typography>
            <Box sx={{
                width: 12,
                height,
                bgcolor: mm > 0 ? color : 'grey.200',
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.3s ease',
            }} />
        </Box>
    )
}

export function WeatherTrendsChart({ fields }) {
    // Collect last N days of rainfall across all fields
    const allDays = []
    fields.forEach(f => {
        if (!f.rainfall30d?.days) return
        f.rainfall30d.days.slice(-DAYS_TO_SHOW).forEach(d => {
            allDays.push({ date: d.date, mm: d.mm ?? 0 })
        })
    })

    // Dedupe by date, average if multiple fields
    const dateMap = {}
    allDays.forEach(d => {
        if (!dateMap[d.date]) dateMap[d.date] = { date: d.date, total: 0, count: 0 }
        dateMap[d.date].total += d.mm
        dateMap[d.date].count += 1
    })
    const days = Object.values(dateMap)
        .map(v => ({ date: v.date, mm: v.total / v.count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-DAYS_TO_SHOW)

    if (days.length === 0) return null

    const maxMm = Math.max(...days.map(d => d.mm), 1)
    const avg = days.reduce((s, d) => s + d.mm, 0) / days.length
    const total = days.reduce((s, d) => s + d.mm, 0)

    const formatDate = (d) => {
        const [, mo, day] = d.split('-')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        return `${parseInt(day)} ${months[parseInt(mo) - 1] ?? mo}`
    }

    return (
        <Paper sx={{ p: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Tren Curah Hujan
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {days.length} hari terakhir · {fields.length} lahan
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="flex-end">
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#2563eb', lineHeight: 1 }}>
                            {total.toFixed(1)} mm
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#38bdf8', lineHeight: 1 }}>
                            {avg.toFixed(1)} mm
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Rata-rata/hari</Typography>
                    </Box>
                </Stack>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 72, overflowX: 'auto' }}>
                {days.map((d, i) => (
                    <Box key={d.date} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 20 }}>
                        <RainBar mm={d.mm} maxMm={maxMm} color="#38bdf8" />
                        <Typography variant="caption" sx={{ fontSize: 8, color: 'text.disabled', mt: 0.5 }}>
                            {formatDate(d.date).split(' ')[0]}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Stack direction="row" justifyContent="space-between" mt={1} px={0.5}>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 9 }}>
                    {days[0] ? formatDate(days[0].date) : ''}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 9 }}>
                    {days[days.length - 1] ? formatDate(days[days.length - 1].date) : ''}
                </Typography>
            </Stack>
        </Paper>
    )
}
