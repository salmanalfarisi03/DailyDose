# DailyDose — Enterprise Business OS

Sistem operasi bisnis dan platform intelijen keuangan eksekutif berbasis web. Aplikasi ini dirancang untuk pemantauan metrik pendapatan, efisiensi kampanye pemasaran, pipeline prospek B2B, manajemen pelanggan (CRM), katalog persediaan produk, penagihan faktur otomatis, serta analisis strategis berbasis model bahasa besar (LLM).

Seluruh antarmuka menggunakan Bahasa Indonesia formal untuk kebutuhan operasional manajemen perusahaan.

---

## Fitur Utama

### 1. Executive Performance Dashboard
- Ringkasan KPI Finansial Real-time: Pemantauan realisasi pendapatan kotor, blended ROAS, nilai rata-rata pesanan (AOV), total transaksi, dan piutang tertunda.
- Grafik Kinerja & Atribusi Kanal: Visualisasi area interaktif dengan penanda pencapaian (milestone), perbandingan performa mingguan, serta perincian per kanal akuisisi (Pencarian Berbayar, Media Sosial Berbayar, Email Marketing, Kreator, dan Program Referral).
- Manajemen Kampanye Langsung: Monitoring alokasi anggaran, realisasi biaya, estimasi sisa waktu, dan tombol kendali status (Aktif / Dijeda).
- Audit Corong Checkout: Pelacakan konversi berjenjang dari sesi keranjang hingga otorisasi pembayaran sukses beserta deteksi titik penurunan (drop-off).
- Pipeline Prospek B2B Prioritas: Daftar prospek bernilai tinggi lengkap dengan skor kualifikasi, estimasi nilai kesepakatan, tahap negosiasi, dan tautan komunikasi langsung (email dan telepon).
- Pacing Anggaran & Target Realisasi: Indikator spedometer realisasi belanja terhadap plafon anggaran bulanan.

### 2. Modul Operasional & Penjualan
- Manajemen Prospek Wholesale: Pipeline terstruktur untuk akun korporat dari tahap baru masuk, discovery call, pengiriman proposal, hingga negosiasi kontrak.
- Kampanye Pemasaran Terpadu: Pemantauan terpusat untuk seluruh kampanye iklan digital dan efisiensi ROAS.
- Segmen Audiens & Penargetan: Segmentasi kohor pelanggan (pembeli tenda, toko grosir independen, keranjang tertinggal, pelari lintas alam) dengan kesiapan integrasi Google Ads, Meta Ads, dan email automation.
- Laporan Keuangan & Audit: Rekapitulasi transaksi kuartalan, audit piutang, evaluasi anggaran iklan, dan ekspor data dalam format CSV.
- Manajemen Pelanggan (CRM): Direktori klien terverifikasi, status keaktifan akun, kontak resmi, dan riwayat transaksi.
- Katalog Produk & Inventori: Pencatatan SKU, harga berpresisi numerik, pelacakan sisa unit di gudang, dan sistem peringatan stok menipis otomatis (kurang dari atau sama dengan 5 unit).
- Faktur & Penagihan (Invoicing): Penerbitan invoice multi-item dengan kalkulasi subtotal, PPN, dan diskon otomatis, pelacakan siklus status pembayaran (Draf, Terbit, Lunas, Jatuh Tempo, Dibatalkan), serta fitur cetak faktur fisik.
- Manajemen Tugas Operasional: Penugasan pekerjaan berbasis prioritas (Rendah, Sedang, Tinggi, Mendesak) yang terhubung ke akun pelanggan spesifik.

### 3. Asisten AI Eksekutif
- Terintegrasi dengan model Google Gemini 1.5 Flash untuk analisis data kontekstual dari database PostgreSQL tanpa halusinasi.
- Drawer Copilot interaktif di dasbor utama serta modul penuh AI Business Suite untuk konsultasi keuangan, audit persediaan, dan rekomendasi mitigasi risiko piutang.
- Pengaturan API Key mandiri yang tersimpan aman pada penyimpanan lokal peramban.

### 4. Portal Keamanan & Autentikasi
- Proteksi otorisasi sesi berbasis token JWT dan enkripsi sandi PBKDF2/bcrypt.
- Manajemen peran pengguna: Direktur Utama (Owner), Administrator Operasional (Admin), dan Spesialis Keuangan (Finance).
- Opsi masuk cepat via SSO korporat (Google Workspace dan Microsoft Entra ID).
- Telemetri status koneksi database pool PostgreSQL dan uptime server backend secara langsung pada header antarmuka.

---

## Arsitektur & Teknologi

| Lapisan | Komponen | Deskripsi |
| :--- | :--- | :--- |
| Frontend | Next.js 16 (App Router) | Server Components dan Client Components berbasis React 19 |
| Bahasa Frontend | TypeScript 5.x | Standar pengetikan statis ketat (strict typing) |
| Desain & Styling | Tailwind CSS v4 + Lucide React | Tampilan Light Luxury Porcelain dengan aksen Iris & Slate |
| Backend API | FastAPI (Python 3.12) | Kerangka kerja web asinkron berkinerja tinggi |
| Validasi Skema | Pydantic v2 | Serialisasi dan validasi data request/response |
| Database ORM | SQLAlchemy 2.0 (Async) | Pemetaan objek relasional asinkron via driver asyncpg |
| Migrasi Skema | Alembic | Manajemen versi dan migrasi skema database terotomasi |
| Database Engine | PostgreSQL 17 / Neon Cloud | Penyimpanan relasional transaksional ACID compliant |
| Kecerdasan Buatan | Google Gemini 1.5 Flash | Analisis inferensi metrik bisnis dan konsultasi eksekutif |

---

## Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Lingkungan
- Python versi 3.12 atau yang lebih baru
- Node.js versi 18 atau yang lebih baru serta npm
- Database PostgreSQL versi 16 atau 17 (dapat menggunakan instalasi lokal maupun layanan cloud seperti Neon)

### 2. Konfigurasi Lingkungan Backend
Buat berkas `.env` di dalam folder `backend/` atau di root proyek sesuai kebutuhan:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=dailydose_app
POSTGRES_PASSWORD=password_database_anda
POSTGRES_DB=dailydose_db
DATABASE_URL=postgresql+asyncpg://dailydose_app:password_database_anda@127.0.0.1:5432/dailydose_db
ENVIRONMENT=development
DEBUG=True
GEMINI_API_KEY=api_key_gemini_anda_opsional
```

### 3. Migrasi Database (Alembic)
Jalankan migrasi skema database dari direktori backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
```

### 4. Menjalankan Backend Service (FastAPI)
Jalankan server pengembangan FastAPI:

```powershell
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Endpoint Root: http://127.0.0.1:8000/
- Pemeriksaan Kesehatan Sistem: http://127.0.0.1:8000/health
- Dokumentasi API Interaktif (Swagger): http://127.0.0.1:8000/docs

### 5. Menjalankan Frontend Service (Next.js)
Buka terminal terpisah untuk menjalankan aplikasi antarmuka:

```powershell
cd frontend
npm install
npm run dev
```

Akses dasbor aplikasi melalui peramban web di: **http://localhost:3000/**

---

## Kredensial Pengguna Bawaan (Default Credentials)

Formulir masuk telah dilengkapi data akun default untuk keperluan pengujian:

| Akun / Jabatan | Alamat Email | Kata Sandi | Peran (Role) | Lingkup Hak Akses |
| :--- | :--- | :--- | :--- | :--- |
| Direktur Utama | `owner@dailydose.ai` | `OwnerPass123!` | OWNER | Akses penuh seluruh metrik finansial, CRM, dan konfigurasi |
| Admin Operasional | `admin@dailydose.ai` | `AdminPass123!` | ADMIN | Manajemen data operasional, prospek, katalog produk, dan tugas |
| Spesialis Keuangan | `finance@dailydose.ai` | `FinancePass123!` | FINANCE | Pengelolaan faktur tagihan, status pembayaran, dan laporan keuangan |

---

## Pengujian Terotomasi (Automated Testing)

Seluruh pengujian unit dan integrasi backend menggunakan pytest:

```powershell
cd backend
pytest -v
```

Hasil pengujian mencakup 57 skenario uji (autentikasi JWT, validasi skema Pydantic, operasi basis data relasional, dan endpoint REST API) dengan tingkat keberhasilan 100%.

---

## Struktur Direktori

```text
dailydose/
├── backend/
│   ├── alembic/              # Berkas migrasi skema database
│   ├── app/
│   │   ├── api/routes/       # Router REST API (auth, customers, products, invoices, tasks, ai)
│   │   ├── core/             # Konfigurasi aplikasi, keamanan, dan koneksi database pool
│   │   ├── models/           # Definisi tabel relasional SQLAlchemy
│   │   ├── schemas/          # Validasi skema input/output Pydantic
│   │   ├── services/         # Logika bisnis transaksi dan operasional
│   │   └── main.py           # Titik masuk aplikasi FastAPI
│   ├── tests/                # Rangkaian pengujian otomatis pytest
│   └── requirements.txt      # Dependensi pustaka Python
├── frontend/
│   ├── src/
│   │   ├── app/              # Routing berbasis App Router Next.js
│   │   ├── components/       # Komponen visual (Executive Dashboard, Modul, Modals)
│   │   ├── lib/              # Klien HTTP API dan helper
│   │   └── types/            # Definisi antarmuka TypeScript
│   ├── package.json          # Dependensi paket Node.js
│   └── tsconfig.json         # Konfigurasi kompilasi TypeScript
├── .gitignore                # Aturan pengecualian berkas git
└── README.md                 # Dokumentasi utama proyek
```

---

## Lisensi & Hak Cipta

Hak cipta (c) 2026 DailyDose. Hak Cipta Dilindungi Undang-Undang.
