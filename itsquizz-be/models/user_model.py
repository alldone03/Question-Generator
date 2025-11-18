from config.database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    jabatan = db.Column(db.String(50), nullable=False)  # teknisi, supervisior, manager, admin operator

    def to_dict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "email": self.email,
            "jabatan": self.jabatan
        }
