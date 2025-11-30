from config.database import db
from datetime import datetime

class UserLevelProgress(db.Model):
    __tablename__ = "user_level_progress"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, nullable=False)
    level_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # "passed" atau "repeat"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "level_id": self.level_id,
            "score": self.score,
            "status": self.status,
            "created_at": self.created_at,
        }
