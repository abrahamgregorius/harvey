import { Stack, Box, Typography } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'

export function AnalyticsPage() {
    return (
        <Stack alignItems="center" justifyContent="center" height="100%" spacing={2}>
            <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
            <Typography color="text.secondary">Analisis dalam pengembangan.</Typography>
        </Stack>
    )
}
