---
description: Panduan Deployment ke cPanel (Shared Hosting)
---

# Panduan Deployment cPanel (Full Stack)

Panduan ini akan membantu Anda mengupload aplikasi Flask (Backend) dan React (Frontend) ke hosting cPanel standar.

## Persiapan Lokal (Local Machine)

1. **Frontend (Build React App)**
   Buka terminal di folder `itsquizz-fe_v2` dan jalankan:
   ```bash
   # Masuk ke folder frontend
   cd itsquizz-fe_v2

   # Install dependencies (jika belum)
   npm install

   # Pastikan file .env.production atau variable environment sudah benar
   # Untuk cPanel, API URL biasanya adalah domain backend Anda
   # Contoh (Windows CMD):
   set VITE_API_URL=https://api.domainanda.com
   npm run build
   # Atau edit manual .env lalu jalankan npm run build
   ```
   *Hasilnya akan ada di folder `dist`. Folder inilah yang akan diupload nanti.*

2. **Backend (Prepare Files)**
   - Pastikan file `passenger_wsgi.py` sudah ada (sudah dibuat otomatis).
   - Pastikan `requirements.txt` bersih dan konsisten (sudah diperbarui).
   - Anda TIDAK PERLU mengupload folder `venv` atau `.git`.

---

## Langkah 1: Setup Database di cPanel

1. Login ke cPanel.
2. Buka **MySQL Database Wizard**.
3. Buat database baru (misal: `u123_itsquizz`).
4. Buat user database baru (misal: `u123_admin`) dan password yang kuat.
5. **PENTING**: Berikan user tersebut *All Privileges* ke database yang baru dibuat.
6. Catat nama database, username, dan password.

---

## Langkah 2: Deployment Backend (Python Flask)

1. Buka menu **Setup Python App** di cPanel.
2. Klik **Create Application**.
   - **Python Version**: Pilih versi Python yang sesuai (misal 3.8 - 3.11, sesuaikan dengan lokal jika bisa).
   - **Application Root**: `itsquizz-backend` (folder tempat file backend ditaruh).
   - **Application URL**: Subdomain atau path API. Disarankan menggunakan subdomain, misal `api.domainanda.com`. (Anda perlu membuat subdomain ini dulu di menu *Domains* jika belum ada).
   - **Application Startup File**: `passenger_wsgi.py` (biarkan kosong passenger_wsgi.py sudah kita buat manual, atau isi `passenger_wsgi.py`).
   - **Application Entry Point**: `application` (sesuai variabel di passenger_wsgi.py).
3. Klik **Create**.
4. Setelah dibuat, akan muncul perintah untuk masuk ke virtualenv di bagian atas. Klik untuk menyalin (Command line to enter virtual environment).
5. **Upload File Backend**:
   - Buka **File Manager** cPanel.
   - Masuk ke folder `itsquizz-backend` (folder root aplikasi yang baru dibuat).
   - Upload semua isi folder lokal `itsquizz-be_v2` (app.py, requirements.txt, folder models, folder routes, dll).
   - **JANGAN** upload folder `__pycache__` atau `venv`.
6. **Install Dependencies**:
   - Anda perlu akses SSH (Terminal cPanel). Jika tidak ada, lihat cara alternatif di bawah*.
   - Jika ada Terminal:
     - Paste command virtual environment yang disalin tadi.
     - Jalankan: `pip install -r requirements.txt`
   - *Alternatif tanpa SSH*: Di halaman **Setup Python App**, ada bagian "Configuration files". Masukkan `requirements.txt` lalu klik tombol "Run Pip Install".
7. **Setup Environment Variables**:
   - Di halaman **Setup Python App**, cari bagian **Environment variables**.
   - Tambahkan variabel sesuai `.env` Anda:
     - `DATABASE_URL`: Format SQLAlchemy MySQL (`mysql+pymysql://user:pass@localhost/dbname`).
       Contoh: `mysql+pymysql://u123_admin:passwordrahasia@localhost/u123_itsquizz`
     - `SECRET_KEY`: String acak yang panjang.
     - `origins`: URL frontend Anda (misal `https://domainanda.com`).
     - `SESSION_TYPE`: `filesystem`
8. **Restart App**: Klik tombol **Restart** di halaman Setup Python App.

---

## Langkah 3: Deployment Frontend (React)

1. **Upload File Frontend**:
   - Buka **File Manager** cPanel.
   - Buka folder `public_html` (untuk domain utama) atau folder subdomain.
   - Upload isi folder `dist` (hasil build di langkah Persiapan).
   - Pastikan file `.htaccess` (yang ada di dalam dist) ikut terupload. File ini penting agar React Router jalan saat di-refresh.
2. **Setup Domain**:
   - Jika file ditaruh di `public_html`, akses `domainanda.com`.
   - Pastikan API URL di frontend sudah benar mengarah ke URL backend (`api.domainanda.com` atau `domainanda.com/api`).

---

NbVd4_;r~Q0=B8n+

## Troubleshooting Umum

1. **525 Internal Server Error / App Error**:
   - Cek log error di file `stderr.log` di dalam folder backend (`itsquizz-backend`).
   - Pastikan nama database/user/password benar.
2. **Halaman Frontend 404 saat refresh**:
   - Pastikan file `.htaccess` ada di folder frontend.
3. **CORS Error**:
   - Pastikan environment variable `origins` di backend mencakup URL frontend Anda (tanpa slash di akhir).
   - Pastikan frontend mengakses backend menggunakan HTTPS jika frontend juga HTTPS.