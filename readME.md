ITSQuizz

Aplikasi ITSQuizz adalah sistem pembuat dan pengelola soal otomatis menggunakan LLM (Llama3).
Proyek ini terdiri dari backend Flask (Python), frontend React (Vite), dan Ollama sebagai model AI lokal.

Struktur Proyek
questionGenerator/
│
├── itsquizz-be/
│   └── backend.py              # Backend Flask + SentenceTransformer + FAISS
│
├── itsquizz-fe/
│   ├── src/                    # Frontend React + Vite
│   └── package.json
│
└── run_all.bat                 # Jalankan semua service sekaligus

1. Persyaratan

Pastikan Anda sudah menginstal:

Python 3.10+

Node.js 18+

npm (terinstal otomatis dengan Node.js)

Ollama (https://ollama.ai
)

Model Llama3 (jalankan: ollama pull llama3)

2. Instalasi Backend

Masuk ke folder backend:

cd itsquizz-be


Instal dependensi Python:

pip install flask flask-cors sentence-transformers PyPDF2 faiss-cpu requests

3. Instalasi Frontend

Masuk ke folder frontend:

cd itsquizz-fe


Instal dependensi React:

npm install

4. Menjalankan Semua Service Otomatis

Gunakan file batch run_all.bat di folder utama:

C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\run_all.bat


Isi file:

@echo off
echo =====================================
echo  Menjalankan semua service ITSQuizz
echo =====================================

REM --- Jalankan Ollama Serve ---
start "OLLAMA" cmd /k "ollama serve"

REM --- Jalankan Frontend (Vite/React) ---
cd /d "C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-fe"
start "FRONTEND" cmd /k "npm run dev"

REM --- Jalankan Backend (Flask) ---
cd /d "C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-be"
start "BACKEND" cmd /k "python backend.py"

REM --- Tunggu beberapa detik agar server siap ---
timeout /t 5 >nul

REM --- Buka otomatis di browser ---
start "" "http://localhost:5173"

echo Semua service telah dijalankan!
pause


Cukup klik dua kali file run_all.bat, semua service akan otomatis berjalan:

Ollama untuk model Llama3

Backend Flask untuk API

Frontend React (Vite) untuk UI

Browser terbuka otomatis di http://localhost:5173

5. Arsitektur Singkat

Frontend (Vite + React)
UI untuk pengguna membuat, mengedit, dan melihat soal.

Backend (Flask)

Mengambil teks dari file PDF (PyPDF2)

Membuat embedding (SentenceTransformer)

Menyimpan vector ke FAISS

Menghubungkan ke Llama3 untuk menghasilkan soal.

Ollama (Llama3)
Menyediakan model bahasa lokal untuk menghasilkan pertanyaan berbasis konteks PDF.

6. Cara Kerja Singkat

Unggah file PDF ke backend.

Backend membaca teks dan membuat embedding.

Sistem menggunakan Llama3 untuk membuat pertanyaan.

Hasil ditampilkan di frontend React.
