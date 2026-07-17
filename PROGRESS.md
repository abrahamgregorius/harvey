<!-- @format -->

# Harvey Progress: Ide → Implementasi

## Ringkasan

| Aspek                      | Plan                        | Status                                        |
| -------------------------- | --------------------------- | --------------------------------------------- |
| Tech stack frontend        | React + Vite + **Tailwind** | React + Vite + **MUI**                        |
| Weather API                | OpenWeatherMap              | **Open-Meteo** (lebih baik, free, no API key) |
| Map                        | Leaflet + OpenStreetMap     | ✅ Same                                       |
| Storage                    | localStorage/IndexedDB      | **Backend API** (localhost:3001)              |
| PWA (offline, installable) | Planned                     | ❌ Not set up                                 |
| WhatsApp deep-link sharing | Planned                     | ❌ Not in UI                                  |

---

## Fitur: Plan vs Implementasi

### ✅ Dashboard (Home)

| Plan (HARVEY.md)            | Implementasi                                            |
| --------------------------- | ------------------------------------------------------- |
| Ringkasan cuaca 5 hari      | ✅ Open-Meteo current + 5-day forecast                  |
| Alert lahan berisiko tinggi | ✅ Metric tiles (total lahan, luas, tanam, jenis tanah) |
| Status musim tanam          | ✅ GrowthCard dengan 4 tahap                            |

**Implemented in:** `HomePage.jsx`, `Home.jsx` (map view)

---

### ✅ Priority Ranking

| Plan                                   | Implementasi                         |
| -------------------------------------- | ------------------------------------ |
| List semua lahan, sorted by risk score | ✅ `calcRiskScore()` + sorted render |
| Filter per fase/jenis/risk level       | ❌ Tidak ada filter UI               |
| Detail per lahan (tap expand)          | ❌ Expand tidak ada                  |
| Export/share ke WhatsApp               | ❌ Tidak ada                         |

**Implemented in:** `WaterAllocationPage.jsx` (lines 8-52)

**Risk scoring formula:**

```
skor = scarcity×0.40 + soilRisk×0.20 + growthScore×0.25 + et×0.15
```

- `scarcity` = rain deficit + temperature
- `soilRisk` = sand percentage
- `growthScore` = phase (Vegetatif/Generatif=1.0, Pra-Panen=0.5, Panen=0.1)
- `et` = evapotranspiration approximation

---

### ✅ Manajemen Lahan

| Plan                       | Implementasi                           |
| -------------------------- | -------------------------------------- |
| Daftar lahan (list + peta) | ✅ FieldsPage table + Home.jsx map     |
| Tambah lahan baru (form)   | ✅ Home.jsx polygon draw + dialog form |
| Edit/nonaktifkan lahan     | ✅ FieldsPage edit dialog + delete     |
| Riwayat lahan per musim    | ❌ Tidak ada                           |

**Implemented in:** `Home.jsx` (polygon draw, save dialog), `FieldsPage.jsx` (list, edit, delete)

---

### ⚠️ Jadwal Irigasi (Recommended Schedule)

| Plan                    | Implementasi |
| ----------------------- | ------------ |
| Kalender jadwal         | ❌ Tidak ada |
| Kirim ke WhatsApp 1 tap | ❌ Tidak ada |
| Riwayat jadwal terkirim | ❌ Tidak ada |

**Partial:** `WaterAllocationPage.jsx` menampilkan ranked list dengan alokasi air proporsional (50000L total, minimum 2000L/lahan).

---

### ❌ Riwayat & Evaluasi

| Plan                            | Implementasi           |
| ------------------------------- | ---------------------- |
| Log keputusan alokasi           | ❌ Tidak ada           |
| Grafik risk score historis      | ❌ Tidak ada           |
| Laporan hasil panen vs prediksi | ❌ Tidak ada (V2 item) |

`AnalyticsPage.jsx` = placeholder stub.

---

### ❌ El Niño Simulator

| Plan                                    | Implementasi |
| --------------------------------------- | ------------ |
| Slider "Tingkat Keparahan El Niño 1-10" | ❌ Tidak ada |
| Live re-calculate all scores            | ❌ Tidak ada |
| Color-coded map updates                 | ❌ Tidak ada |

---

### ❌ Harvey Score & Harvey Soil

| Plan                                                 | Implementasi |
| ---------------------------------------------------- | ------------ |
| Gauge 0-100 "Skor Ketahanan Klaster"                 | ❌ Tidak ada |
| Sustainability score (praktik rotasi, pupuk organik) | ❌ Tidak ada |
| Badge "Bankable" / "Eligible for CSR"                | ❌ Tidak ada |

---

## Services

| Service               | Plan                   | Implementasi                                                        |
| --------------------- | ---------------------- | ------------------------------------------------------------------- |
| `weatherService.js`   | OWM                    | ✅ Open-Meteo (current + 5-day + archive)                           |
| `soilService.js`      | SoilGrids API          | ✅ Static Indonesia soil zone table (SoilGrids REST paused 2026-07) |
| `rainfallService.js`  | CHIRPS                 | ✅ Open-Meteo archive (CHIRPS substitute)                           |
| `geoService.js`       | GPS + polygon area     | ✅ turf.js polygon area + centroid + slope                          |
| `fieldStore.js`       | localStorage/IndexedDB | ✅ Backend REST API (localhost:3001)                                |
| `elevationService.js` | SRTM/DEM               | ✅ Stub elevation from Open-Meteo response                          |

---

## What Was Skipped (Intentionally)

1. **PWA** no `vite-plugin-pwa`, no manifest.json, no service worker. Build is plain Vite SPA.
2. **WhatsApp deep-link** no `wa.me` button in UI despite being trivial.
3. **Tailwind** MUI was used instead. Plan docs said Tailwind but MUI is already in codebase.
4. **El Niño slider, Harvey Score, Harvey Soil** intentionally skipped per YAGNI; these are post-MVP features.
5. **Backend** `fieldStore.js` points to `localhost:3001` but no backend code exists in this repo.

---

## Gap Analysis: What Needs Work

### Critical (breaks if used today)

- **No backend** `fieldStore.js` hits `localhost:3001` which doesn't exist in this repo. Fields can't be saved/persisted.
- **No PWA** can't install, no offline mode. Beats the "zero-install" pitch.

### Missing MVP features

- WhatsApp share button
- Filter/sort on priority ranking
- Calendar view for recommended schedule
- Field history per season

### Nice-to-have

- El Niño slider (planned gimmick)
- Harvey Score gauge
- Harvey Soil checklist
- Analytics graphs
