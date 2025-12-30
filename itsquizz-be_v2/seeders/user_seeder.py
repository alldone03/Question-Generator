from models import User
from config.database import db
from utils.hash import hash_password

def seed_users():
    users = [
        User(
            nip="002",
            nama="Teknisi A",
            email="teknisi@mail.com",
            password=hash_password("admin123"),
            jabatan="Teknisi"
        ),
        User(
            nip="001",
            nama="spadm",
            email="spadm@mail.com",
            password=hash_password("admin123"),
            jabatan="SuperAdmin"
        )
    ]

    db.session.bulk_save_objects(users)
    db.session.commit()