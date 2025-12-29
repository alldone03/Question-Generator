from config.database import db

class Module(db.Model):
    __tablename__ = "modules"

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey("assessments.id"), nullable=False)
    nama_module = db.Column(db.String(150), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    jenis_module = db.Column(db.String(50), nullable=False)
    waktu_pengerjaan = db.Column(db.Integer)
    feedback = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
