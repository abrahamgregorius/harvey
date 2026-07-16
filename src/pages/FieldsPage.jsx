import { useState } from 'react'
import { Stack, Box, Typography, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, OutlinedInput } from '@mui/material'
import MapAltIcon from '@mui/icons-material/Map'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router-dom'
import { getGrowthStage } from '../utils/growthUtils'
import { updateField } from '../services/fieldStore.js'

export { getGrowthStage }

export function FieldsPage({ fields, onDelete, onUpdate }) {
    const [editField, setEditField] = useState(null)

    const handleEditOpen = (field) => {
        setEditField({ ...field })
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
                            <Stack direction="row" sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}>
                                {['Nama', 'Luas', 'Suhu', 'Humid', 'Angin', 'Tanam', 'Tahap', '', ''].map(h => (
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
                                        <IconButton size="small" onClick={() => handleEditOpen(f)} sx={{ color: 'primary.main', flex: 1 }}>
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
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
        </Stack>
    )
}
