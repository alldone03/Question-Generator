from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True)
    level_name = Column(String)

    course_id = Column(Integer, ForeignKey("courses.id"))
    course = relationship("Course", back_populates="levels")

    questions = relationship("Question", back_populates="level")