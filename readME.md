ITSQuizz – AI Question Generator

ITSQuizz adalah aplikasi pembuat pertanyaan otomatis berbasis Flask (Python) di sisi backend dan React + Vite di sisi frontend.
Model AI yang digunakan adalah Llama 3 (via Ollama) untuk memproses teks dari dokumen PDF dan menghasilkan pertanyaan.

Struktur Proyek
questionGenerator/
│
├── itsquizz-be/               # Backend (Python Flask)
│   ├── backend.py
│   └── requirements.txt
│
├── itsquizz-fe/               # Frontend (React + Vite)
│   ├── package.json
│   ├── src/
│   └── ...
│
└── run_all.bat                # File untuk menjalankan semua service otomatis

1. Backend (Flask)

Lokasi:
C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-be\backend.py

Fungsi utama:

Membaca dokumen PDF menggunakan PyPDF2

Mengubah teks menjadi embedding dengan SentenceTransformer

Menyimpan dan mencari embedding dengan FAISS

Melayani permintaan dari frontend melalui Flask API

Mendukung komunikasi lintas domain dengan Flask-CORS

Library yang digunakan:

from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from flask import Flask, jsonify, request
import faiss, requests, json, os
from flask_cors import CORS


Menjalankan manual:

cd itsquizz-be
python backend.py

2. Frontend (React + Vite)

Lokasi:
C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-fe

Teknologi:

React

Vite

Tailwind CSS (opsional)

Komunikasi API ke Flask backend

Menjalankan manual:

cd itsquizz-fe
npm install
npm run dev


Frontend dapat diakses di:
http://localhost:5173

3. Llama 3 via Ollama

ITSQuizz menggunakan Llama 3 melalui Ollama untuk menghasilkan pertanyaan dari teks dokumen.
Pastikan Ollama sudah terinstal dan model Llama 3 sudah diunduh.

Menjalankan Ollama secara manual:

ollama serve


Menjalankan model Llama 3:

ollama run llama3

4. Jalankan Semua Service Sekaligus

File otomatis:
C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\run_all.bat

Isi file:

@echo off
echo =====================================
echo  Menjalankan semua service ITSQuizz
echo =====================================

start "OLLAMA" cmd /k "ollama serve"

cd /d "C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-fe"
start "FRONTEND" cmd /k "npm run dev"

cd /d "C:\Users\LENOVO\OneDrive\Desktop\questionGenerator\itsquizz-be"
start "BACKEND" cmd /k "python backend.py"

timeout /t 5 >nul
start "" "http://localhost:5173"

echo Semua service telah dijalankan!
pause


Cara pakai:

Pastikan semua dependency sudah terinstal.

Klik dua kali run_all.bat.

Sistem otomatis akan menjalankan:

Ollama (Llama 3)

Frontend (Vite/React)

Backend (Flask)

Membuka browser ke localhost:5173

5. Persiapan Lingkungan
Python
pip install flask flask-cors PyPDF2 sentence-transformers faiss-cpu requests

Node.js
npm install

Ollama + Llama3

Download dan install dari:
https://ollama.ai

6. Cara Kerja Singkat

Pengguna mengunggah file PDF melalui frontend.

Backend membaca isi PDF dan membuat embedding teks.

Ollama (Llama 3) memproses teks menjadi pertanyaan.

Hasil ditampilkan di frontend.

7. Lisensi

Proyek ini dibuat untuk keperluan penelitian dan pembelajaran.
Gunakan secara bebas dengan menyertakan kredit kepada pembuat.
