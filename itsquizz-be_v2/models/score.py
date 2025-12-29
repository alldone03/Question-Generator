from config.database import db
from datetime import datetime

class Score(db.Model):
    __tablename__ = "scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("modules.id"), nullable=False)
    score = db.Column(db.Integer)
    sisa_waktu_pengerjaan = db.Column(db.Integer)
    feedback = db.Column(db.Text)
    is_feedback_given = db.Column(db.Boolean, default=False)
    percobaan_ke = db.Column(db.Integer)
    tanggal_pengerjaan = db.Column(db.DateTime, default=datetime.utcnow)