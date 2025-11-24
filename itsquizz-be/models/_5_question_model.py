from config.database import db

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey("course_levels.id"), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    level = db.relationship("CourseLevel", backref="questions")

    def to_dict(self):
        return {
            "id": self.id,
            "level_id": self.level_id,
            "question_text": self.question_text,
            "question_type": self.question_type,
            "created_at": self.created_at
        }
