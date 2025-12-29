from werkzeug.security import generate_password_hash
from models._1_user_model import User
from config.database import db

def run():
    data = [
        {
            "nama": "ITS ",
            "email": "its@gmail.com",
            "password": "its12345",
            "jabatan": "Teknisi"
        }
    ]

    for u in data:
        cek = User.query.filter_by(email=u["email"]).first()
        if cek:
            continue

        user = User(
            nama=u["nama"],
            email=u["email"],
            password=generate_password_hash(u["password"]),
            jabatan=u["jabatan"]
        )

        db.session.add(user)

    db.session.commit()
    print("User seeder berhasil.")
