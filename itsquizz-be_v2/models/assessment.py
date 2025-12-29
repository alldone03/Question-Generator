from config.database import db
from datetime import datetime

class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    nama_assessment = db.Column(db.String(150), nullable=False)
    jabatan = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    modules = db.relationship("Module", backref="assessment", lazy=True)