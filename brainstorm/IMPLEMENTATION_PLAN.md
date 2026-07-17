<!-- @format -->

# Validasi Harvey Perspektif Judge & Tech Consultant

> **Positioning inti:** Harvey adalah DSS alokasi irigasi lahan sawah berbasis data cuaca (curah hujan, suhu, kelembaban), fase tanam, dan kondisi tanah **bukan berbasis sensor hardware**. Ini yang membedakan dari SIPASI dan memungkinkan MVP murah dan cepat deploy.

## Penilaian Umum

Harvey ini solid untuk level hackathon MVP. Beberapa alasan kenapa saya bilang begitu:

**Yang kuat:**

- **Problem framing jelas dan jujur.** Dokumen ini secara eksplisit membedakan antara "klaim" dan "target pilot" ini jarang saya lihat di deck hackathon, dan justru meningkatkan kredibilitas di mata juri teknis. Banyak tim over-promise; kalian under-promise dengan sengaja.
- **Positioning yang defensible.** "Group-level priority ranking, bukan individual recommendation" adalah differentiator yang nyata, bukan sekadar marketing copy karena secara arsitektur data memang berbeda (butuh data multi-lahan, bukan single-lahan).
- **Scope MVP realistis.** Tidak coba menjawab semua hal (water allocation penuh) cuma menjawab yang bisa dijawab dengan data yang tersedia (risk ranking). Ini pertanda tim paham batas kemampuan sistemnya sendiri.
- **Distribusi output lewat WhatsApp** adalah keputusan UX yang sangat tepat untuk konteks petani Indonesia zero-install adoption barrier removal.
- **Archival value:** Risk score + histori keputusan Harvey literally adalah "credit data" yang belum pernah dimiliki petani kecil foundation untuk parametric insurance dan akses kredit.

**Yang perlu diwaspadai / akan ditanya juri:**

1. **Risk scoring formula (0.3/0.2/0.3/0.2)** sudah kalian anticipate jawabannya, bagus. Tapi juri teknis kemungkinan akan minta lihat formula aktualnya secara live, bukan cuma bobot. Siapkan 1 slide/screen yang menunjukkan variabel apa saja yang masuk (curah hujan 5 hari, fase tanam, jenis tanah, dst) dan bagaimana mereka dinormalisasi ke skala 0–1.
2. **"P3A leader" sebagai user persona** perlu divalidasi apakah P3A leader di lapangan benar-benar punya smartphone + akses browser yang reliable. Kalau tidak, PWA-nya harus dipakai oleh PPL (Penyuluh Pertanian Lapangan) sebagai proxy, bukan P3A leader langsung. Ini worth diklarifikasi di pitch supaya tidak ada gap asumsi.
3. **Data cuaca 5 hari dari OpenWeatherMap** untuk keputusan pertanian granular per-desa akurasi OWM di wilayah rural Indonesia cukup kasar (grid besar). Ini oke untuk MVP tapi siap-siap dtanya soal akurasi spasial.
4. **Model bisnis** Dinas Pertanian sebagai payer itu realistis tapi procurement cycle-nya panjang (sudah kalian sadari). Pastikan pitch tidak terlalu bergantung pada government sales cycle untuk traksi awal; strategi "mitra lokal dulu" itu sudah tepat, tekankan itu.
5. **El Niño Simulator** gimmick demo paling kuat. Slider interaktif yang secara live me-re-render risk ranking + Harvey Score gauge ini yang bikin juri ingat 20 pitch kemudian.

---

## Fitur & Menu (untuk PWA)

Saya susun berdasarkan 2 tipe user: **P3A Leader/PPL** (admin) dan sistem otomatis backend.

### Struktur Menu Utama

```
📱 Harvey PWA
│
├── 🏠 Dashboard (Home)
│   ├── Ringkasan cuaca 5 hari (lokasi klaster)
│   ├── Alert lahan berisiko tinggi (top 3)
│   └── Status musim tanam aktif
│
├── 📊 Priority Ranking
│   ├── List semua lahan (sorted by risk score)
│   ├── Filter: per fase tanam / per jenis tanaman / per risk level
│   ├── Detail per lahan (tap untuk expand)
│   └── Export/Share ke WhatsApp
│
├── 🌾 Manajemen Lahan
│   ├── Daftar lahan (list + peta sederhana)
│   ├── Tambah lahan baru (form: nama, luas, jenis tanaman, varietas, tanggal tanam, tipe tanah)
│   ├── Edit / non-aktifkan lahan (misal sudah panen)
│   └── Riwayat lahan per musim
│
├── 📅 Jadwal Irigasi (Recommended Schedule)
│   ├── Kalender jadwal yang disarankan
│   ├── Kirim jadwal ke grup WhatsApp (1 tap)
│   └── Riwayat jadwal terkirim
│
├── 📈 Riwayat & Evaluasi
│   ├── Log keputusan alokasi per musim
│   ├── Grafik risk score historis per lahan
│   └── (V2) Laporan hasil panen vs prediksi risiko
│
└── ⚙️ Pengaturan
    ├── Profil klaster/kelompok tani
    ├── Anggota grup WhatsApp
    └── Preferensi notifikasi
```

### Detail Fitur Inti (MVP)

| Fitur                              | Deskripsi                                                                                             | Prioritas                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Onboarding lahan**               | Form input sekali di awal musim (nama, luas, tanaman, varietas, tanggal tanam, jenis tanah)           | Must-have                                                   |
| **Auto crop-phase calculator**     | Hitung otomatis minggu ke-berapa & fase tanam berdasar siklus (padi 14mgg, cabai 12mgg, jagung 13mgg) | Must-have                                                   |
| **Weather fetch (GPS-based)**      | Ambil data cuaca real-time + forecast 5 hari dari OpenWeatherMap berdasar lokasi lahan                | Must-have                                                   |
| **Risk scoring engine**            | Hitung skor risiko puso (0.0–1.0) berbasis kombinasi cuaca + fase tanam + kondisi tanah               | Must-have (core differentiator)                             |
| **Priority ranking view**          | Sort & tampilkan lahan dari risiko tertinggi ke terendah                                              | Must-have                                                   |
| **Recommended schedule generator** | Saran urutan/waktu irigasi berdasarkan ranking                                                        | Must-have                                                   |
| **WhatsApp share/deep-link**       | Kirim ringkasan jadwal ke grup WA (pakai `wa.me` link, bukan Business API dulu)                       | Must-have                                                   |
| **Seed data demo (15–20 plot)**    | Data dummy untuk demo hackathon                                                                       | Must-have untuk demo                                        |
| **Offline-first caching**          | Data terakhir tetap bisa dilihat tanpa koneksi (krusial untuk area rural)                             | Should-have ini justru bagus dipakai sebagai keunggulan PWA |
| **El Niño Simulator slider**       | Slider "Tingkat Keparahan El Niño 1–10" → re-calculates all scores live, color-coded map updates      | Must-have (gimmick #1 highest demo recall)                  |
| **Harvey Score gauge**             | Gauge 0–100 "Skor Ketahanan Klaster" dari histori risk + konsistensi keputusan P3A                    | Should-have (extension challenge #4 data sudah ada di MVP)  |
| **Harvey Soil checklist**          | Log praktik: rotasi, pupuk organik, konservasi air + Sustainability Score                             | Should-have (extension challenge #5 data sudah ada di MVP)  |
| **Push notification (PWA)**        | Alert kalau ada lahan yang risk score-nya naik drastis                                                | Nice-to-have                                                |
| **Multi-klaster support**          | Satu akun bisa kelola >1 klaster (untuk PPL yang handle beberapa P3A)                                 | V2                                                          |

> **Catatan:** Harvey Score dan Harvey Soil BUKAN produk asuransi/kredit. Harvey menyediakan **data layer** yang membuat petani kecil bisa dinilai (bankable). Monetisasi produk finansial = kerja sama V2/V3 dengan bank/asuransi mitra.

---

## Implementation Plan

### Fase 0 Hackathon MVP (yang sekarang)

**Tech stack rekomendasi (cepat, PWA-native):**

- **Frontend:** React + Vite (PWA plugin: `vite-plugin-pwa`) biar installable, punya service worker, dan offline caching out-of-the-box
- **Styling:** Tailwind cepat untuk bikin dashboard/table yang rapi
- **State/data:** Data lahan disimpan di localStorage/IndexedDB dulu (tanpa perlu backend server penuh) cukup untuk demo
- **Weather API:** OpenWeatherMap One Call API (free tier, 5-day forecast)
- **Maps (opsional ringan):** Leaflet + OpenStreetMap tiles untuk visualisasi lokasi lahan (gratis, tanpa API key)
- **WhatsApp delivery:** `https://wa.me/<nomor>?text=<pesan>` deep link tidak perlu Business API approval untuk demo

**Urutan build (untuk waktu terbatas hackathon):**

1. Setup PWA shell (manifest.json, service worker, installable) 1–2 jam
2. Form input lahan + auto crop-phase calculator 2–3 jam
3. Integrasi OpenWeatherMap + fetch by GPS/koordinat lahan 2 jam
4. Risk scoring formula (implementasi sebagai fungsi murni, mudah dites & dijelaskan ke juri) 2–3 jam
5. **El Niño Simulator slider** PRIORITAS, bikin duluan karena ini gimmick paling kuat untuk demo 2-3 jam
6. Ranking view + sorting/filtering 1–2 jam
7. Recommended schedule generator (rule-based, bukan ML dulu) 1–2 jam
8. Harvey Score gauge + formula sederhana (dari histori risk score + konsistensi keputusan) 2 jam
9. Harvey Soil checklist + sustainability score 1-2 jam
10. WhatsApp share button 30 menit
11. Seed 15–20 data dummy lahan yang representatif (variasi risiko tinggi/rendah) 1 jam
12. Polish UI + siapkan demo flow (skenario cerita: "Pak Slamet, Ketua P3A Klaster Sukamaju, buka Harvey jam 6 pagi, geser El Niño slider, lihat ranking berubah, kirim jadwal ke WA") 1–2 jam

### Fase 1 Post-hackathon / Pilot Prep (kalau lolos ke tahap pilot)

- Backend proper (Node/Express atau Supabase) untuk multi-user & data persistence
- Autentikasi sederhana per P3A/klaster
- Validasi risk scoring weights dengan expert/BPTP (bukan lagi placeholder)
- Testing di 1 klaster nyata dengan data real (bukan seed dummy)

### Fase 2 V2

- BMKG partnership, CHIRPS, GPM NASA sebagai sumber data cuaca tambahan
- WhatsApp Business API resmi (bukan deep-link manual)
- Dashboard multi-klaster untuk Dinas Pertanian
- Partnership bank/asuransi untuk parametric product (bukan produk Harvey data layer saja)
- Decision audit trail untuk musyawarah P3A

### Fase 3 V3

- IoT soil moisture probe per cluster
- Data debit sungai real-time, volume embung
- Supply-constrained allocation (risk ranking + data suplai)
- Conflict-aware scheduling
- Integration layer ke SIPASI

---

## Kenapa PWA (bukan native app)?

Ini keputusan yang tepat untuk konteks Harvey, dan worth ditekankan ke juri:

1. **Zero-install friction** konsisten dengan filosofi "petani tidak perlu install app" yang sudah kalian pegang untuk WhatsApp; PWA untuk P3A leader juga bisa "Add to Home Screen" tanpa app store
2. **Offline capability** service worker bisa cache data ranking terakhir, penting untuk area dengan koneksi internet tidak stabil (khas daerah pertanian)
3. **Cross-platform tanpa 2x development** P3A leader mungkin pakai HP Android low-end; PWA jalan di browser apa pun
4. **Update instan** tidak perlu approval app store untuk push fix/update saat pilot berjalan

### Demo Talking Points

Berikut 4 momen demo yang bikin juri ingat Harvey di antara 20 pitch lain:

**1. El Niño Simulator interactive slider (momen "aha" visual)**
Taruh slider "Tingkat Keparahan El Niño" (1–10) di dashboard. Waktu digeser live:

- Peta lahan berubah warna (hijau→kuning→merah)
- Priority ranking re-sort otomatis
- Harvey Score gauge turun + premi parametrik mockup naik
  → Juri lihat langsung: data cuaca menjelma jadi angka finansial nyata

**2. Harvey Score gauge ala credit score**
Gauge 0-100 "Skor Ketahanan Klaster", lengkap badge "Bankable" / "Perlu Perbaikan". Mirip skor fintech yang juri kenal, applied ke domain petani kecil yang belum pernah disentuh.

**3. Persona: "Pak Slamet"**
_"Pak Slamet, Ketua P3A Klaster Sukamaju. Biasanya butuh 3 jam meeting untuk putuskan siapa dapat air duluan. Hari ini, buka Harvey jam 6 pagi..."_ storytelling, bukan fitur.

**4. Live WhatsApp send**
Kirim beneran via `wa.me` deep link di depan juri. Notifikasi WA masuk = "oh ini beneran zero-friction."

**Kalimat kunci (tidak dianggap overclaim):**
_"Harvey Score dan Harvey Soil BUKAN produk asuransi atau kredit itu tetap peran mitra finansial. Harvey menyediakan data layer yang membuat petani kecil bisa dinilai (bankable), yang sebelumnya tidak mungkin karena tidak ada jejak data."_

---

**3 Modul (1 platform, 1 data flow):**

```
MODUL 1: HARVEY RANKING (core)
Weather + fase tanam + tanah → Risk Score → Priority ranking → Recommended schedule
        │
        │ setiap keputusan & outcome tercatat
        ▼
MODUL 2: HARVEY SCORE (challenge #4)
Histori risk management + keputusan P3A → "Skor Ketahanan Klaster" (0-100)
→ Basis parametric insurance & credit scoring
        │
        │ ditambah data praktik tanam
        ▼
MODUL 3: HARVEY SOIL (challenge #5)
Log praktik: rotasi, pupuk organik, konservasi air → Sustainability Score
→ Basis akses CSR/ESG funding
```

> Harvey Score dan Harvey Soil tidak butuh data source baru recycle data yang sudah diinput di Modul 1 + 1-2 field praktik. Tidak ada kompleksitas tambahan.

---

## Menu PWA

```
📱 Harvey PWA
│
├── 🏠 Dashboard
│   ├── El Niño Simulator (slider interaktif)
│   ├── Ringkasan cuaca 5 hari
│   ├── Peta klaster (color-coded by risk)
│   └── Alert lahan berisiko tinggi
│
├── 📊 Priority Ranking
│   └── (seperti sebelumnya)
│
├── 🌾 Manajemen Lahan
│   └── (seperti sebelumnya, + field baru: praktik tanam)
│
├── 💳 Harvey Score  ← BARU
│   ├── Gauge score klaster (0-100)
│   ├── Riwayat skor per musim (grafik tren)
│   ├── Simulasi: "Kalau skor naik 10 poin, potensi akses kredit/asuransi apa?"
│   └── Export laporan skor (untuk diajukan ke bank/asuransi mitra)
│
├── 🌱 Harvey Soil  ← BARU
│   ├── Log praktik berkelanjutan (checklist sederhana: rotasi, pupuk organik, dll)
│   ├── Sustainability score
│   └── Badge "Eligible for CSR support"
│
├── 📅 Jadwal Irigasi
│   └── (seperti sebelumnya)
│
└── ⚙️ Pengaturan
```

---

## Implementation Plan (Realistis untuk Waktu Hackathon)

**Prinsip: bangun yang bisa dibuktikan, pitch-kan yang visioner jangan campur.**

| Item                                    | Status di Demo                                                                           | Effort                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Harvey Ranking (core)                   | **Fully functional**                                                                     | Sudah ada plan-nya                                                 |
| El Niño Simulator slider                | **Fully functional** ini prioritas gimmick #1                                            | 2-3 jam (cuma re-kalkulasi formula existing berdasar slider value) |
| Harvey Score gauge + formula            | **Fully functional** formula sederhana dari histori risk score + konsistensi keputusan   | 3-4 jam                                                            |
| Harvey Soil checklist + score           | **Fully functional** checklist manual, scoring rule-based                                | 2 jam                                                              |
| Parametric insurance/credit _product_   | **Vision slide only** jangan build, cukup mockup angka "jika skor > 70, premi turun 20%" | 0 jam build, 1 slide desain                                        |
| Post-harvest waste / marketplace bridge | **Vision slide only** (challenge #1, #3)                                                 | 1 slide roadmap, jangan dipaksa jadi fitur                         |

**Kalimat kunci saat pitching (biar tidak dianggap overclaim):**

> _"Harvey Score dan Harvey Soil BUKAN produk asuransi atau kredit itu tetap peran mitra finansial. Harvey menyediakan **data layer yang membuat petani kecil bisa dinilai (bankable)**, yang sebelumnya tidak mungkin karena tidak ada jejak data. Kami fokus di lapisan data & insight; monetisasi produk finansial adalah kerja sama V2/V3 dengan bank/asuransi mitra."_

Ini menjaga kejujuran ala Harvey yang sudah kuat (dan yang bikin juri percaya), sambil tetap kasih visi besar yang "wah".

---
