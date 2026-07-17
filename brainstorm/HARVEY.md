# Harvey: DSS Alokasi Irigasi Lahan Sawah Indonesia

**Apa Harvey:** Sistem DSS berbasis data cuaca (curah hujan, suhu, kelembapan), fase tanam, dan kondisi tanah — untuk membantu P3A meranking prioritas irigasi lahan sawah ketika air terbatas.

**Bukan sensor.** Harvey menggunakan data dari API cuaca terbuka dan input manual, bukan hardware sensor. Ini yang membedakan dari SIPASI dan sistem irigasi modern lainnya — tidak perlu beli, pasang, atau maintenance sensor lapangan.

**Tagline:** _"Petani kecil tidak kekurangan data — mereka kekurangan cara membuat data itu dipercaya. Harvey mengubah setiap keputusan irigasi jadi jejak data yang bisa membuka akses finansial."_

---

## 1. Latar Belakang (Background)

### Krisis Air di Sektor Pertanian Indonesia

Indonesia adalah salah satu negara agraris terbesar di dunia dengan lebih dari **23 juta rumah tangga petani**. Sektor pertanian menyumbang sekitar **13% PDB nasional** dan menyerap hampir **29% angkatan kerja**. Namun produktivitas sektor ini semakin terancam oleh perubahan iklim, terutama perubahan pola hujan dan peningkatan frekuensi fenomena El Niño.

Tahun 2023–2024, fenomena El Niño menyebabkan kerugian besar di sektor pertanian Indonesia — jutaan ton produksi padi gagal panen, ratusan ribu hektar sawah mengalami kekeringan. BMKG memproyeksikan kondisi ini tidak akan membaik dalam waktu dekat.

### El Niño 2026: Bukan Prediksi, Sudah Terjadi

El Niño berkekuatan kuat diproyeksikan bertahan hingga **awal 2027**. BMKG memperkirakan lebih dari **80% wilayah Indonesia** akan mengalami curah hujan di bawah normal pada periode **Juli–Oktober 2026** — bulan-bulan kritis untuk musim tanam kedua di banyak daerah.

Bagi petani yang bergantung pada hujan, ini bukan sekadar masalah produktivitas. Ini adalah masalah kelangsungan hidup.

---

## 2. Masalah Global → Masalah Lokal

### Masalah Global: Perubahan Iklim dan Kekeringan

Perubahan iklim global menyebabkan:

- Pola hujan makin tidak terprediksi
- Musim kemarau makin panjang dan intens
- Kekeringan pertanian makin sering dan makin panjang
- FAO memperkirakan produktivitas pertanian global turun **26%** jika pemanasan global mencapai 2°C

### Masalah Lokal: P3A Membuat Keputusan Alokasi Air Tanpa Data Prediktif

Di Indonesia, saat kemarau panjang, air irigasi menjadi **sumber daya yang terbatas**.

PPL (Penyuluh Pertanian Lapangan)

Di tingkat kelompok tani (P3A/Kelompok Tani/Koperasi), P3A leader kadang perlu membuat keputusan: lahan mana yang perlu mendapat prioritas air ketika supply tidak mencukupi semua.

**Masalah yang sebenarnya:**

P3A leader membuat keputusan alokasi air dengan informasi yang terbatas:

- Mereka tahu cuaca **hari ini** — tapi tidak punya visibility ke **5 hari ke depan**
- Mereka tahu kondisi lahannya — tapi tidak punya **data terstruktur** untuk membandingkan risiko tiap lahan secara objektif
- Ketika membuat keputusan, tidak ada **legitimasi data** yang bisa menunjukkan mengapa keputusan itu diambil

**Hasil yang mungkin terjadi tanpa alat bantu:**

- Keputusan didasarkan pada **subjektivitas** leader atau tekanan sosial
- Tidak ada **jejak rekam** untuk evaluasi setelah musim panen
- Petani yang tidak mendapat air merasa keputusan tidak adil karena tidak ada data yang menjelaskan mengapa

> **"P3A leader tidak butuh alat yang menggantikan keputusannya. Mereka butuh alat yang memberikan informasi untuk membuat keputusan yang lebih baik — dan bisa dipertanggungjawabkan."**

### Mengapa Masalah Ini Belum Ada yang Menyentuh

Semua aplikasi pertanian digital yang ada saat ini (Agri Cuaca, SmartFarm, peTani, agriagent.co.id) berfokus pada **satu petani, satu lahan**. Tidak satu pun yang membantu P3A leader melakukan **evaluasi risiko gabungan** seluruh lahan dalam satu kelompok.

**SIPASI 2.0 (UGM)** mengisi gap berbeda: modernisasi irigasi berbasis sensor — monitoring real-time curah hujan, kelembaban tanah, level air, dan rekomendasi operasional. SIPASI kuat di efisiensi irigasi teknis.

**Harvey mengisi celah yang belum disentuh:** keputusan prioritas antar-lahan dalam konteks **konflik sosial P3A** — siapa didahulukan, kenapa, dan bagaimana keputusan itu bisa dipertanggungjawabkan. Harvey dan SIPASI saling melengkapi: SIPASI menjawab "bagaimana mengelola irigasi secara modern," Harvey menjawab "siapa yang diprioritaskan saat air tidak cukup."

**Celah lain yang masih terbuka:** decision audit trail untuk musyawarah P3A, conflict-aware scheduling, supply-constrained allocation (V3), offline-first + WhatsApp-first UX, dan kalibrasi lokal per komoditas. Integration layer ke SIPASI memungkinkan Harvey menjadi "priority engine" di atas sistem monitoring yang sudah ada.

Ini celah yang belum diisi.

---

## 3. Solusi: Harvey

### Apa Itu Harvey

Harvey adalah **Decision Support System (DSS) yang membantu P3A memprioritaskan lahan yang paling membutuhkan air ketika pasokan terbatas** — bukan aplikasi untuk petani individu, bukan alat pengatur distribusi air secara otomatis.

Fungsi inti: **menyortir dan meranking lahan mana yang paling berisiko mengalami puso duluan**, berdasarkan kombinasi data cuaca, fase tanam, dan kondisi tanah — sehingga P3A bisa membuat keputusan alokasi yang **adil, transparan, dan berbasis data**.

> **Batasan penting:** Harvey bukan pengatur distribusi air secara langsung. Harvey memberikan informasi prioritas. Keputusan akhir tetap di tangan P3A/Kelompok.

### Cara Kerja

```
P3A Leader / PPL membuka Harvey via browser di HP
    ↓
P3A Leader menginput data awal setiap musim tanam:
   - Nama lahan, luas, jenis tanaman, varietas, tanggal tanam
   (dilakukan sekali di awal musim, auto-calculated setelahnya)
    ↓
GPS mendeteksi lokasi → cuaca real-time dari OpenWeatherMap
    ↓
Sistem menghitung skor risiko puso lahan
    ↓
Ranking ditampilkan: lahan mana yang perlu diprioritaskan dapat air
    ↓
P3A Leader mengirim jadwal irigasi ke petani lewat WhatsApp
```

### Output Harvey: Risk Assessment → Priority Ranking → Recommended Schedule

```
Risk Assessment       →  Skor risiko tiap lahan (0.0 – 1.0)
        ↓
Priority Ranking      →  Urutan lahan dari paling berisiko ke paling aman
        ↓
Recommended Schedule  →  Saran jadwal irigasi berdasarkan prioritas
                          (bukan alokasi otomatis — P3A decide)
```

**Mengapa tidak "Water Allocation"?** Karena alokasi air yang sesungguhnya juga bergantung pada data suplai: debit sungai, volume embung, tinggi muka air, jadwal bukaan pintu air. Data ini belum tersedia di MVP. Harvey menjawab pertanyaan yang bisa dijawab dengan data yang ada.

### Yang Membedakan Harvey

| Aspek           | Kompetitor                   | Harvey                                     |
| --------------- | ---------------------------- | ------------------------------------------ |
| Unit analisis   | 1 petani, 1 lahan            | 1 kelompok/klaster lahan                   |
| Fokus           | "Apa yang harus saya tanam?" | "Lahan mana yang paling butuh air duluan?" |
| Output          | Rekomendasi individual       | Priority ranking + recommended schedule    |
| Keputusan akhir | Petani sendiri               | P3A/Kelompok (DSS-assisted)                |
| Alokasi air     | Tidak terkoordinasi          | Terkoordinasi via P3A                      |

### Perbandingan Teknologi

| Fitur                            | Harvey MVP              | Kompetitor   | Catatan                    |
| -------------------------------- | ----------------------- | ------------ | -------------------------- |
| Weather data                     | ✅ OWM real-time        | ✅ Real-time | OWM free tier untuk MVP    |
| Crop phase tracking              | ✅                      | ✅           | Input manual di awal musim |
| Risk scoring                     | ✅                      | ❌           | Core differentiator        |
| Group-level ranking              | ✅                      | ❌           | **Fitur utama**            |
| Recommended schedule             | ✅                      | ❌           | **Fitur utama**            |
| Water supply data (debit/embung) | ❌ V3                   | ❌           | Roadmap V3                 |
| IoT integration                  | Roadmap V3              | ❌           |                            |
| Hardware sensor di lapangan      | ❌ — API + input manual | ✅           | Ini bedanya dari SIPASI    |

---

## 4. Dampak (Impact)

### Dampak Langsung

1. **Berpotensi mengurangi konflik antar-petani** — alokasi air berbasis data, bukan hubungan sosial atau suap
2. **Diharapkan mengurangi risiko gagal panen** — lahan berisiko tinggi mendapat prioritas pemeriksaan
3. **Efisiensi pengambilan keputusan** — P3A leader bisa membuat prioritas dalam hitungan menit, bukan jam meeting dan negosiasi

> **Catatan:** Klaim dampak di bawah ini adalah target pilot. Belum ada data pembuktian dari lapangan. Semua akan divalidasi melalui pilot 3 kabupaten setelah implementasi.

### Dampak Lingkungan

Ini bagian yang sering diabaikan oleh solusi pertanian digital:

Tanpa alat bantu alokasi, ketika air terbatas:

- Petani tertentu melakukan **over-extraction** — mengambil air sebanyak-banyaknya untuk lahannya sendiri, mengERINGkan saluran irigasi untuk petani lain
- Hasil: seluruh klaster malah kekurangan air

Dengan keputusan berbasis data:

- Setiap lahan mendapat **prioritas yang adil**
- Konsumsi air lebih terkontrol → **berpotensi mengurangi over-extraction**
- Seluruh klaster lebih survivable → **konflik menurun**

### Dampak Ekonomi (Target Pilot)

| Parameter                  | Baseline (estimasi)           | Target Sesudah Harvey                         |
| -------------------------- | ----------------------------- | --------------------------------------------- |
| Kerugian puso per klaster  | ~Rp 15 juta/musim             | Diharapkan turun setelah pilot divalidasi     |
| Waktu keputusan P3A leader | ~2–4 jam (meeting, negosiasi) | Target < 5 menit dengan dashboard data        |
| Legitimasi keputusan       | Subjektif, tanpa data         | Berbasis data yang bisa ditunjukkan ke petani |

> Semua angka di atas adalah target dan estimasi, bukan klaim. Baseline "sering konflik" tidak divalidasi secara data — perlu pilot untuk konfirmasi.

---

## 5. Implementasi

### Bagaimana Harvey Tahu Fase Tanam Setiap Lahan?

Ini pertanyaan penting yang perlu dijawab:

**Jawaban:** Data fase tanam diinput **sekali oleh P3A Leader / PPL di awal musim tanam** saat mendaftarkan lahan baru:

- Tanggal tanam
- Jenis tanaman + varietas
- Luas lahan
- Tipe tanah

Setelah itu, sistem **menghitung otomatis** minggu ke-berapa dan fase apa tanaman tersebut berada berdasarkan siklus tanaman (padi 14 minggu, cabai 12 minggu, jagung 13 minggu). Tidak ada input berulang dari petani.

Ini adalah asumsi MVP yang perlu dijelaskan saat Q&A: **saat ini fase tanam diinput manual**. Di versi V3, data ini bisa divalidasi dengan citra satelit (LAPAN/Australia National University crop mapping).

### Keterbatasan MVP yang Perlu Disadari

| Keterbatasan                         | Penjelasan                            | Solusi V3                        |
| ------------------------------------ | ------------------------------------- | -------------------------------- |
| Data ketersediaan air belum ada      | Harvey tidak tahu debit sungai/embung | IoT sensor + data debit          |
| Fase tanam input manual              | Belum otomatis dari data satelit      | Integrasi citra satelit          |
| Risk scoring pakai bobot placeholder | 0.3/0.2/0.3/0.2 perlu kalibrasi       | Kalibrasi dengan BPTP saat pilot |

### Roadmap Implementasi

```
V1 — MVP Hackathon (SAAT INI)
├── Weather: OpenWeatherMap free tier ✅
├── Crop phase: input manual di awal musim ✅
├── Risk scoring: formula berbasis data ✅
├── Seed data: 15–20 plot demo ✅
├── Output: Risk Assessment → Priority Ranking → Recommended Schedule ✅
└── Status: Siap demo

V2 — 6 Minggu Setelah Pilot ($15K)
├── BMKG real-time integration (partnership)
├── CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)
│   → Data hujan satelit yang lebih akurat untuk wilayah Indonesia
├── GPM NASA (Global Precipitation Measurement)
│   → Data presipitasi global, gratis,覆盖 Indonesia
├── WhatsApp Business API (real delivery ke petani)
├── Dashboard P3A yang lebih lengkap
└── Kalibrasi bobot risk scoring dengan data BPTP

V3 — 12 Minggu ($45K Total)
├── IoT soil moisture probe per cluster
├── Data debit sungai real-time
├── Volume embung / tinggi muka air
├── Prediksi ketersediaan air
└── AI optimization untuk recommended schedule
```

**Mengapa CHIRPS dan GPM NASA?** Karena kedua sumber ini sudah tersedia gratis,覆盖 wilayah Indonesia, dan telah digunakan oleh banyak lembaga iklim dunia. Lebih cocok untuk skala Indonesia dibanding OWM yang global.

### Arsitektur Data MVP

| Layer                 | Data                                                            | Sumber                                                | Frekuensi Update          | Cara Olah                                               | Output                   |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------- | ------------------------------------------------------- | ------------------------ |
| Master data lahan     | Nama plot, luas, komoditas, varietas, tanggal tanam, tipe tanah | Input manual P3A/PPL                                  | Sekali di awal musim      | Validasi format, simpan ke database                     | Profil lahan per plot    |
| Data fase tanam       | Minggu tanam, fase vegetatif/generatif/matang                   | Dihitung sistem dari tanggal tanam + siklus komoditas | Harian otomatis           | Rule-based calculation                                  | Fase tanam aktif         |
| Data cuaca historis   | Curah hujan, suhu, kelembapan                                   | API cuaca / sumber terbuka                            | Harian                    | Normalisasi, rolling average, anomaly check             | Skor tekanan cuaca       |
| Prakiraan cuaca       | Hujan 3–5 hari ke depan                                         | API cuaca / sumber terbuka                            | Harian                    | Ambil probabilitas hujan, konversi ke risiko kekeringan | Skor risiko ke depan     |
| Data kondisi tanah    | Tipe tanah, kapasitas simpan air                                | Input manual saat setup                               | Manual saat setup         | Mapping tipe tanah ke parameter risiko                  | Bobot risiko tanah       |
| Data observasi lapang | Kering/tidak, retak tanah, gejala layu, foto                    | PPL/P3A via form                                      | Harian atau saat inspeksi | Skor observasi lapang                                   | Penyesesuaian risk score |
| Data status air lokal | Ada/tidak air di saluran, tinggi muka air sederhana             | Input PPL/P3A, optional sensor                        | Harian bila tersedia      | Threshold-based                                         | Koreksi prioritas        |
| Risk engine           | Gabungan semua fitur di atas                                    | Internal system                                       | Harian otomatis           | Bobot + rule + scoring                                  | Risk score 0–1           |
| Ranking engine        | Urutan lahan dari paling berisiko                               | Internal system                                       | Harian otomatis           | Sort by risk score                                      | Priority ranking         |
| Recommendation layer  | Saran urutan irigasi, catatan alasan                            | Internal system                                       | Harian atau saat diminta  | Template recommendation                                 | Jadwal rekomendasi       |
| Notification layer    | Ringkasan jadwal/prioritas                                      | WhatsApp / dashboard / PDF                            | Saat ada update           | Render ke format singkat                                | Pesan ke petani          |

### App Flow

```
P3A/PPL login via browser HP
    ↓
Tambah/ubah data awal lahan
    - nama plot, luas, komoditas, varietas, tanggal tanam, tipe tanah
    ↓
Sistem ambil data cuaca harian
    + input observasi lapang bila ada
    ↓
Sistem hitung fase tanam otomatis
    ↓
Risk engine menghitung skor tiap lahan
    ↓
Ranking lahan dari paling berisiko ke paling aman
    ↓
Dashboard menampilkan:
    - prioritas irigasi
    - alasan skor
    - ringkasan rekomendasi
    ↓
P3A memutuskan jadwal irigasi final
    ↓
Ringkasan dikirim ke petani via WhatsApp
    ↓
Keputusan dan hasilnya disimpan sebagai histori
```

### Tech Stack MVP

| Layer             | Pilihan                                | Alasan                                                     |
| ----------------- | -------------------------------------- | ---------------------------------------------------------- |
| Frontend          | React + Vite + PWA plugin              | Installable, service worker, offline caching, mobile-first |
| Styling           | Tailwind CSS                           | Cepat, dashboard.table yang rapi                           |
| State/data        | localStorage/IndexedDB                 | Cukup untuk MVP demo, tanpa backend penuh                  |
| Weather API       | OpenWeatherMap free tier               | Sudah terverifikasi berfungsi                              |
| Maps              | Leaflet + OpenStreetMap                | Gratis, tanpa API key                                      |
| WhatsApp delivery | `wa.me/<nomor>?text=<pesan>` deep link | Zero-approval demo                                         |
| Backend (V2+)     | FastAPI + PostgreSQL                   | Scoring engine + data persistence                          |

> **PWA, bukan native app:** zero-install untuk P3A leader, offline caching untuk daerah dengan koneksi tidak stabil, cross-platform tanpa development terpisah.

### Siapa yang Membayar

**Customer bukan petani — institusi:**

| Customer                      | Alasan Membayar                                                 |
| ----------------------------- | --------------------------------------------------------------- |
| **Dinas Pertanian Kabupaten** | APBD bencana kekeringan sudah dialokasikan setiap tahun El Niño |
| **P3A / Kelompok Tani**       | Membership fee kecil per bulan                                  |
| **Kementan**                  | Program darurat pangan + climate adaptation budget              |
| **CSR Perusahaan Agri-input** | Skema ESG + butuh proyek nyata                                  |

### Model Revenue

- **Pilot 3 kabupaten**: $X (near-term, konkret) — setup + training + 6 bulan subscription
- **Per kabupaten lanjutan**: $Y per tahun — subscription SaaS
- **TAM aspirational**: 416 kabupaten pertanian × $Y — angka aspirational, bukan janji

> **Catatan:** Proses pengadaan pemerintah cenderung panjang. Strategi awal lebih efektif melalui **mitra lokal** (koperasi, P3A) sebelum masuk melalui Dinas Pertanian formal.

### Bagaimana Petani Menerima Output

Petani **tidak perlu install app**. Mereka menerima jadwal rekomendasi via **WhatsApp** — yang sudah ada di HP setiap petani Indonesia.

Ini menjawab pertanyaan adopsi: **zero friction, zero install, zero training**.

---

## 6. Ringkasan

| Pertanyaan                      | Jawaban                                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Masalah apa yang dipecahkan?    | P3A leader membuat keputusan alokasi air tanpa data prediktif dan tanpa legitimasi data untuk keputusan yang diambil |
| Apa sebenarnya Harvey?          | Decision Support System, bukan pengatur air otomatis                                                                 |
| Siapa customer?                 | Dinas Pertanian + P3A / Kelompok Tani                                                                                |
| Apa yang membedakannya?         | Group-level priority ranking — tidak ada kompetitor yang melakukan ini                                               |
| Output Harvey apa?              | Risk Assessment → Priority Ranking → Recommended Schedule                                                            |
| Bagaimana petani terima info?   | WhatsApp — tanpa install app                                                                                         |
| Keterbatasan MVP?               | Data ketersediaan air belum ada, fase tanam input manual                                                             |
| Berapa biaya implementasi awal? | Pilot 3 kabupaten + 6 minggu + $X konkret                                                                            |

---

## Catatan Teknis untuk Q&A

| Pertanyaan Juri                                 | Jawaban                                                                                                                                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Bobot 0.3/0.2 dari mana?"                      | "Expert-informed placeholder. Akan dikalibrasi dengan data BPTP saat pilot."                                                                                                              |
| "Fase tanam怎么 dihitung?"                      | "Diinput manual oleh PPL/P3A leader sekali di awal musim tanam. Sistem menghitung otomatis setelahnya."                                                                                   |
| "Kenapa tidak pakai BMKG?"                      | "Sudah dicoba — Cloudflare blokir. OWM free tier untuk MVP. BMKG + CHIRPS + GPM NASA sebagai target V2."                                                                                  |
| "Kenapa bukan water allocation, hanya ranking?" | "Karena alokasi air nyata juga butuh data suplai: debit sungai, volume embung. Data ini baru tersedia di V3. Harvey menjawab pertanyaan yang bisa dijawab dengan data yang ada."          |
| "Ini klaim kalian?"                             | "Impact adalah target pilot, bukan klaim. Kami akan validasi melalui pilot 3 kabupaten."                                                                                                  |
| "Konflik air beneran turun?"                    | "Belum ada bukti lapangan — karena itu kami sebut 'berpotensi mengurangi'. Target pilot adalah mengukur ini."                                                                             |
| "Bedanya sama SIPASI?"                          | "SIPASI pakai sensor hardware di lapangan. Harvey pakai API cuaca terbuka + input manual. Harvey lebih murah, lebih cepat deploy, tapi data tidak se-akurat sensor. tradeoff yang sadar." |
| "Kenapa bukan sensor?"                          | "Sensor itu: beli, pasang, maintenance, kalibrasi — mahal dan lambat. Untuk MVP, API cuaca + PPL input sudah cukup untuk risk ranking. Sensor masuk di V3."                               |
