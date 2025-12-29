from config.database import db

class Option(db.Model):
    __tablename__ = "options"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    opsi = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
