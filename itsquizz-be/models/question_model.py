from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    soal = Column(String)
    A = Column(String)
    B = Column(String)
    C = Column(String)
    D = Column(String)
    jawaban = Column(String)

    level_id = Column(Integer, ForeignKey("levels.id"))
    level = relationship("Level", back_populates="questions")
