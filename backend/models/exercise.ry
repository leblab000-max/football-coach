from sqlalchemy import Column, Integer, String, Text, Float
from database import Base

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    age_min = Column(Integer, default=6)
    age_max = Column(Integer, default=17)
    difficulty = Column(String, default="medium")
    equipment = Column(String, default="")
    description = Column(Text, default="")
    coaching_points = Column(Text, default="")
    duration_minutes = Column(Integer, default=10)
    min_players = Column(Integer, default=4)
    max_players = Column(Integer, default=20)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    