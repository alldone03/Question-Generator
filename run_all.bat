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