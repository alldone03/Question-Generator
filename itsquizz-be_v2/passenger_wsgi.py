import sys
import os

# Menambahkan directory saat ini ke path agar modul bisa ditemukan
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app

# 'application' adalah entry point standar yang dicari oleh Passenger/WSGI
application = create_app()
