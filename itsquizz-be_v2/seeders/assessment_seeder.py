from models import Assessment
from config.database import db

def seed_assessments():
    data = [
        Assessment(
            nama_assessment="Layanan Sarana dan Prasarana",
            jabatan="Teknisi"
        ),
        Assessment(
            nama_assessment="Gedung dan Ruang Terbuka Hijau (RTH)",
            jabatan="Teknisi"
        ),
        Assessment(
            nama_assessment="Smart Eco-Campus",
            jabatan="Teknisi"
        ),
    ]

    db.session.bulk_save_objects(data)
    db.session.commit()