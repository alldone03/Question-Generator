from config.database import db

class LearningModule(db.Model):
    __tablename__ = "learning_modules"

    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey("modules.id"), nullable=False)
    judul = db.Column(db.String(150), nullable=False)
    file_pdf = db.Column(db.String(255))