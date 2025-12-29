from config.database import db

class AnswerLog(db.Model):
    __tablename__ = "answer_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("modules.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    selected_index = db.Column(db.Integer, nullable=False)
    correct_index = db.Column(db.Integer, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    time_spent = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
