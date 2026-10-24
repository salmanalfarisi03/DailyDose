# 🏢 DailyDose AI — Enterprise Business OS

> **Modern Executive Business Operating System & Financial Intelligence Platform**  
> Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **FastAPI (Python 3.12)**, **PostgreSQL 17 RDS**, **SQLAlchemy 2.0 Async ORM**, **Alembic**, dan **Google Gemini 1.5 Flash**.

---

## 🌟 Fitur Unggulan Proyek

### 1. Executive Portal (SCREEN_1 Gateway)
- **Desain Korporat Mewah**: Tampilan bersih obsidian slate (`#0f172a`), tipografi tajam, dan kontras visual seimbang 1 viewport.
- **Top Bar Telemetri Real-time**: Indikator koneksi database `PostgreSQL 17 RDS | Terhubung (24ms)` dan status mesin `FastAPI Engine Online`.
- **Animasi Jalur Aspal & Truk Eksekutif**: Animasi truk kargo DailyDose melaju di atas jalur aspal gelap dengan roda yang menapak sempurna dan berputar realistis.
- **Kartu Otorisasi Eksekutif**: Autentikasi aman dengan email korporat, bullet sandi interaktif (show/hide), checkbox sesi 30 hari, dan SSO (Google Workspace & Microsoft Entra ID).
- **Security Gatekeeper**: Proteksi rute otomatis — dashboard bisnis terkunci aman sampai pengguna melakukan otentikasi.

### 2. Executive Management Dashboard
- **KPI Real-Time**: Total pendapatan lunas (*realized revenue*), tagihan jatuh tempo (*outstanding*), jumlah pelanggan aktif, dan status inventori.
- **Ringkasan Arus Kas**: Komparasi grafis kinerja omset dan margin likuiditas.
- **Telemetry Monitor**: Status latensi server dan koneksi database pool.

### 3. Modul Bisnis Inti
- **Manajemen Pelanggan**: CRUD lengkap, pencarian real-time, validasi email korporat, dan status keaktifan.
- **Katalog Produk & Inventori**: Manajemen SKU, harga berskala numerik presisi (`Numeric(12, 2)`), peringatan stok menipis otomatis.
- **Faktur & Penagihan (Invoicing)**: Pembuatan faktur dinamis beritem banyak, kalkulasi otomatis subtotal/pajak/diskon, serta alur status (*Draft* ➔ *Issued* ➔ *Paid* / *Overdue*).
- **Papan Kanban Tugas Bisnis**: Drag & drop kolom (*Todo*, *In Progress*, *Done*), penetapan prioritas dan relasi pelanggan.

### 4. AI Executive Advisor (Powered by Google Gemini 1.5 Flash)
- Menganalisis kondisi finansial riil dari database PostgreSQL tanpa halusinasi data.
- Memberikan rekomendasi strategis berkala untuk mitigasi risiko piutang dan optimasi inventori.

---

## 🛠️ Tech Stack & Arsitektur

| Lapisan (Layer) | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components + Client Interactivity |
| **Language (Frontend)** | **TypeScript 5.x** | Static Typing & Type Safety |
| **Styling & Icons** | **Tailwind CSS v4 + Lucide React** | Modern Slate Corporate Styling |
| **Backend API** | **FastAPI (Python 3.12)** | Asynchronous RESTful API High-Performance |
| **Data Validation** | **Pydantic v2** | Strict Schema Validation & Error Parsing |
| **Database ORM** | **SQLAlchemy 2.0 (Async)** | Asyncpg Connection Pool |
| **Database Migration** | **Alembic** | Version-Controlled Database Schema Migrations |
| **Database Engine** | **PostgreSQL 17** | Relational Database ACID Compliance |
| **Generative AI** | **Google Gemini 1.5 Flash** | Executive Business Advisory & Reasoning |

> 📖 **Pelajari Seluruh Alur & Flowchart Lengkap**:  
> Silakan baca [BLUEPRINT.md](BLUEPRINT.md) untuk panduan arsitektur ramah pemula dan contekan wawancara kerja!

---

## 🚀 Panduan Menjalankan Aplikasi (Quick Start)

### 1. Prasyarat Sistem
- Python 3.12+
- Node.js 18+ & npm
- PostgreSQL 16 atau 17

### 2. Konfigurasi Environment (`.env`)
Salin file konfigurasi contoh ke `.env` di direktori utama:
```powershell
Copy-Item .env.example .env
```
Sesuaikan kredensial PostgreSQL lokal Anda:
```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=dailydose_app
POSTGRES_PASSWORD=password_postgres_anda
POSTGRES_DB=dailydose_db
GEMINI_API_KEY=api_key_gemini_anda_opsional
```

### 3. Migrasi Database (Alembic)
Jalankan migrasi agar seluruh tabel terbuat secara otomatis di PostgreSQL:
```powershell
cd backend
.\.venv\Scripts\alembic.exe upgrade head
```

### 4. Menjalankan Backend (FastAPI)
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Root: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 5. Menjalankan Frontend (Next.js)
Buka terminal baru di folder `frontend`:
```powershell
cd frontend
npm run dev
```
Buka browser di: **[http://localhost:3000/](http://localhost:3000/)**

---

## 🔑 Kredensial Masuk Eksekutif (Default Credentials)

Halaman login telah terisi default dengan kredensial berikut:

| Akun | Email | Kata Sandi | Peran (Role) | Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Owner / Managing Dir.** | `aditya.dharma@dailydose.ai` | `OwnerPass123!` | `OWNER` | Akses Penuh ke Seluruh Metrik & AI Advisor |
| **Operations Admin** | `admin@dailydose.ai` | `AdminPass123!` | `ADMIN` | Manajemen Operasional, Pelanggan & Produk |
| **Finance Specialist** | `finance@dailydose.ai` | `FinancePass123!` | `FINANCE` | Manajemen Tagihan & Pembayaran Faktur |

*Catatan: Tombol **"Lanjutkan dengan Google Workspace"** dan **"Lanjutkan dengan Microsoft Entra ID"** juga tersedia untuk akses instan demo eksekutif.*

---

## 🧪 Pengujian Terotomasi (Automated Tests)

Seluruh 57 unit & integration tests di backend dapat dijalankan menggunakan pytest:
```powershell
cd backend
.\.venv\Scripts\pytest.exe -v
```
Hasil: **100% Passed (57 passed in ~4.5s)**.

---

## 📁 Struktur Direktori Singkat

```text
dailydose/
├── backend/            # FastAPI, SQLAlchemy Models, Alembic Migrations, Tests
│   ├── app/
│   │   ├── api/        # REST API Routes (/auth, /customers, /products, /invoices, /ai)
│   │   ├── core/       # Database Pool & Config
│   │   ├── models/     # Database Tables (SQLAlchemy)
│   │   ├── schemas/    # Request/Response Validation (Pydantic)
│   │   └── services/   # Business Logic
│   └── tests/          # Pytest Suite
├── frontend/           # Next.js 16 App Router & Tailwind CSS
│   └── src/
│       ├── app/        # Page Routing & Layouts
│       ├── components/ # Landing Portal, Executive Dashboard, Modals
│       └── lib/        # API Client & State
├── BLUEPRINT.md        # Panduan Belajar Komprehensif & Flowchart Sistem
└── README.md           # Dokumentasi Utama
```

---

## 📄 Lisensi & Hak Cipta
© 2026 **DailyDose AI Enterprise Business OS**. Hak Cipta Dilindungi.
