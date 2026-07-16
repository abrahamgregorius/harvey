const API = 'http://localhost:3001/api/fields'

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
