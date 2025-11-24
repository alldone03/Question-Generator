from config.database import db

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "course_name": self.course_name
        }