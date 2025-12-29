from models import Assessment
from config.database import db

def seed_assessments():
    data = [
        Assessment(
            nama_assessment="Pemeliharaan Sarana dan Prasarana",
            jabatan="Teknisi"
        ),
        Assessment(
            nama_assessment="Gedung dan RTH",
            jabatan="Teknisi"
        ),
    ]

    db.session.bulk_save_objects(data)
    db.session.commit()