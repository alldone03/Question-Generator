import sys
import os

# Menambahkan directory saat ini ke path agar modul bisa ditemukan
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app

# 'application' adalah entry point standar yang dicari oleh Passenger/WSGI
application = create_app()


from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    """
    Simulasi 1 user manusia
    """
    wait_time = between(1, 3)  # jeda antar request (realistis)

    def on_start(self):
        """
        Dijalanin sekali saat user mulai
        Cocok untuk login
        """
        self.client.get("http://157.245.58.49/")  # warm-up koneksi

    @task(3)
    def homepage(self):
        """
        Akses halaman utama (paling sering)
        """
        self.client.get("http://157.245.58.49/")

    

    # ===== UNCOMMENT JIKA ADA LOGIN =====
    @task(1)
    def login(self):
        self.client.post("http://157.245.58.49/login", data={
            "username": "test",
            "password": "test"
        })

