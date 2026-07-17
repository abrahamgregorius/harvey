const API = 'http://localhost:3001/api/fields'
const RISK_API = 'http://localhost:3001/api/calculate-risk'
const RISK_BATCH_API = 'http://localhost:3001/api/risks/batch'
const RISK_HISTORY_API = 'http://localhost:3001/api/risks/history'

export async function storeField(field) {
    const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
    })
    if (!res.ok) throw new Error(`storeField failed: ${res.status}`)
    return res.json()
}

export async function getFields() {
    const res = await fetch(API)
    if (!res.ok) throw new Error(`getFields failed: ${res.status}`)
    return res.json()
}

export async function deleteField(id) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`deleteField failed: ${res.status}`)
}

export async function updateField(id, field) {
    const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
    })
    if (!res.ok) throw new Error(`updateField failed: ${res.status}`)
    return res.json()
}

// ponytail: uses backend FAO-56 engine; temp used for both max/min as approximation
export async function calculateRisk(field) {
    const res = await fetch(RISK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            soilType: field.soilType,
            cropType: field.crop_type,
            plantDate: field.plantingDate,
            logDate: new Date().toISOString().split('T')[0],
            latitude: field.lat,
            tempMax: field.temp ?? 30,
            tempMin: (field.temp ?? 30) - 5,
            rainfallMm: field.rainfall30d?.avg_mm ?? field.rainfall_mm ?? 0,
            irrigationMm: 0,
        }),
    })
    if (!res.ok) throw new Error(`calculateRisk failed: ${res.status}`)
    return res.json()
}

// ponytail: batch risk — elNino pre-processing matches backend logic
export async function calculateRiskBatch(fields, elNino = 0) {
    const payload = fields.map((f) => ({ ...f, elNino }));
    const res = await fetch(RISK_BATCH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: payload }),
    });
    if (!res.ok) throw new Error(`calculateRiskBatch failed: ${res.status}`);
    return res.json();
}

export async function getRiskHistory(fieldId, days = 30, elNino = 0) {
    const res = await fetch(`${RISK_HISTORY_API}/${fieldId}?days=${days}&elNino=${elNino}`);
    if (!res.ok) throw new Error(`getRiskHistory failed: ${res.status}`);
    return res.json();
}
