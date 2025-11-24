from config.database import db

class CourseLevel(db.Model):
    __tablename__ = "course_levels"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    level_name = db.Column(db.String(100), nullable=False)

    course = db.relationship("Course", backref="levels")

    def to_dict(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "level_name": self.level_name
        }