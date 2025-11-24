from config.database import db

class UserScore(db.Model):
    __tablename__ = "user_scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("course_levels.id"), nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    finished_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "level_id": self.level_id,
            "total_questions": self.total_questions,
            "correct_answers": self.correct_answers,
            "score": self.score,
            "finished_at": self.finished_at
        }