export function getGrowthStage(plantingDate) {
    if (!plantingDate) return { stage: 'Belum Tanam', color: '#64748b', days: 0 }
    const days = Math.floor((Date.now() - new Date(plantingDate)) / 86400000)
    if (days < 0) return { stage: 'Belum Tanam', color: '#64748b', days }
    if (days < 30) return { stage: 'Vegetatif', color: '#4ade80', days }
    if (days < 60) return { stage: 'Generatif', color: '#38bdf8', days }
    if (days < 90) return { stage: 'Pra-Panen', color: '#fb923c', days }
    return { stage: 'Panen', color: '#f87171', days }
}
