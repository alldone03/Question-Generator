from config.database import db

class QuestionOption(db.Model):
    __tablename__ = "question_options"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    option_text = db.Column(db.String(300), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)

    question = db.relationship("Question", backref="options")

    def to_dict(self):
        return {
            "id": self.id,
            "question_id": self.question_id,
            "option_text": self.option_text,
            "is_correct": self.is_correct
        }
