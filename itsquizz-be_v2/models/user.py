from config.database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nip = db.Column(db.String(50))
    nama = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    jabatan = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    scores = db.relationship("Score", backref="user", lazy=True)
    def to_dict(self):
        return {
            "id": self.id,
            "nip": self.nip,
            "nama": self.nama,
            "email": self.email,
            "jabatan": self.jabatan,
            "created_at": self.created_at
        }