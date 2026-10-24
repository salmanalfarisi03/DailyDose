# 🚀 Panduan Lengkap Deploy DailyDose AI ke Render.com (100% Gratis)

> **Panduan Praktis Langkah demi Langkah untuk Pemula**  
> Semua layanan (**PostgreSQL Database + FastAPI Backend + Next.js Frontend**) berjalan bersama dalam 1 akun Render.com secara gratis.

---

## 📋 Ringkasan Persiapan yang Sudah Disediakan
Sistem telah disiapkan secara otomatis di kode proyek:
1. **[render.yaml](render.yaml)**: File Blueprint Infrastructure-as-Code (IaC) untuk otomatisasi setup 1-klik di Render.
2. **Normalisasi Database URL**: Backend otomatis mendukung skema `postgres://` maupun `postgresql://` dari cloud Render.
3. **Konfigurasi CORS Cloud**: Backend otomatis mengizinkan domain `*.onrender.com` dan `*.vercel.app`.
4. **Build Script & Migrasi**: Script otomatis menjalankan migrasi database Alembic saat server pertama kali dinyalakan.

---

## 🛠️ Langkah 1: Push Proyek ke GitHub
Jika proyek Anda belum ada di GitHub:
1. Buka terminal atau GitHub Desktop.
2. Lakukan commit dan push ke repository GitHub Anda (bisa **Public** atau **Private**):
   ```powershell
   git add .
   git commit -m "feat: ready for render deployment"
   git push origin main
   ```

---

## ⚡ Langkah 2: Deploy Otomatis (Metode Paling Mudah — Blueprint 1-Klik)

Render memiliki fitur **Blueprint** yang membaca file [render.yaml](render.yaml) di repository Anda, sehingga database, backend, dan frontend langsung dibuat otomatis secara bersamaan:

1. Buka dan login ke dashboard **[dashboard.render.com](https://dashboard.render.com)** menggunakan akun GitHub Anda.
2. Klik tombol biru **"New +"** di pojok kanan atas.
3. Pilih menu **"Blueprint"**.
4. Hubungkan (*Connect*) repository GitHub proyek **DailyDose AI** Anda.
5. Beri nama grup Blueprint, misal: `dailydose-app`.
6. Render akan membaca [render.yaml](render.yaml) dan menampilkan 3 komponen yang akan dibuat:
   - 🐘 **dailydose-db** (PostgreSQL Database - Free)
   - 🐍 **dailydose-backend** (FastAPI Python Web Service - Free)
   - ⚛️ **dailydose-frontend** (Next.js Node Web Service - Free)
7. Klik tombol **"Apply"**.
8. Render akan otomatis:
   - Membuat database PostgreSQL.
   - Menginstal library Python, menjalankan migrasi Alembic, dan menjalankan FastAPI.
   - Meng-compile Next.js dan menjalankan frontend.
9. Selesai! Anda akan mendapatkan URL web publik, contoh:  
   `https://dailydose-frontend.onrender.com`

---

## 🖱️ Langkah Alternatif: Deploy Manual via UI Render (Jika Tidak Menggunakan Blueprint)

Jika Anda lebih suka membuat satu per satu lewat tombol:

### 1. Buat Database PostgreSQL
1. Di Render Dashboard, klik **"New +"** ➔ **"PostgreSQL"**.
2. **Name**: `dailydose-db`
3. **Database**: `dailydose_db`
4. **User**: `dailydose_app`
5. **Region**: `Singapore` (terdekat dan tercepat untuk Indonesia).
6. **Plan**: `Free`.
7. Klik **"Create Database"**.
8. Setelah statusnya *Available*, salin **Internal Database URL** (jika backend di Render) atau **External Database URL**.

### 2. Buat Web Service Backend (FastAPI)
1. Klik **"New +"** ➔ **"Web Service"**.
2. Pilih repository GitHub Anda.
3. Masukkan konfigurasi:
   - **Name**: `dailydose-backend`
   - **Region**: `Singapore`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. Di bagian **Environment Variables**:
   - `DATABASE_URL`: *(tempel URL database PostgreSQL dari langkah 1)*
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`
5. Klik **"Create Web Service"**.
6. Tunggu hingga build selesai dan muncul URL backend Anda, misal:  
   `https://dailydose-backend.onrender.com`.

### 3. Buat Web Service Frontend (Next.js)
1. Klik **"New +"** ➔ **"Web Service"**.
2. Pilih repository GitHub yang sama.
3. Masukkan konfigurasi:
   - **Name**: `dailydose-frontend`
   - **Region**: `Singapore`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Di bagian **Environment Variables**:
   - `NODE_VERSION`: `20`
   - `NEXT_PUBLIC_API_URL`: `https://dailydose-backend.onrender.com` *(URL backend dari langkah 2)*
5. Klik **"Create Web Service"**.

---

## 💡 Catatan Penting Mengenai Free Tier di Render.com

1. **Efek Cold-Start (Server Tidur Setelah 15 Menit Tidak Aktif)**:
   - Di paket gratis Render, jika tidak ada pengguna yang membuka web selama 15 menit, server backend akan otomatis tidur untuk menghemat daya.
   - Saat ada orang pertama yang membuka web kembali, backend butuh sekitar 30–50 detik untuk bangun. Setelah itu, web akan kembali cepat seperti biasa.
   - *Tips:* Sebelum melakukan presentasi atau interview kerja, buka web Anda 1 menit sebelumnya agar servernya sudah terbangun aktif.

2. **Database PostgreSQL Free Tier**:
   - Database gratis Render aktif selama 30 hari pertama. Jika untuk jangka panjang selamanya tanpa batas waktu, Anda juga bisa menggabungkannya dengan database gratis dari **[Supabase.com](https://supabase.com)** (gratis 500 MB selamanya tanpa masa kedaluwarsa).

---

## 🎯 Cara Memverifikasi Setelah Web Live
1. Buka URL frontend Anda di browser, misal: `https://dailydose-frontend.onrender.com`.
2. Periksa apakah halaman **Executive Portal (SCREEN_1)** muncul dengan animasi truk di aspal.
3. Klik tombol **"Masuk ke Sistem Kendali"**.
4. Periksa apakah metrik di **Executive Dashboard (SCREEN_2)** termuat dengan status dot hijau `PostgreSQL 17 RDS | Terhubung`.
