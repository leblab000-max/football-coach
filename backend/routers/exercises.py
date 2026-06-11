from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.exercise import Exercise
from pydantic import BaseModel

router = APIRouter(prefix="/exercises", tags=["exercises"])

class ExerciseCreate(BaseModel):
    name: str
    category: str
    age_min: int = 6
    age_max: int = 17
    difficulty: str = "medium"
    equipment: str = ""
    description: str = ""
    coaching_points: str = ""
    duration_minutes: int = 10
    min_players: int = 4
    max_players: int = 20

@router.get("/")
def get_exercises(db: Session = Depends(get_db)):
    return db.query(Exercise).all()

@router.post("/")
def create_exercise(exercise: ExerciseCreate, db: Session = Depends(get_db)):
    db_exercise = Exercise(**exercise.dict())
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise

@router.get("/{exercise_id}")
def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Упражнение не найдено")
    return exercise
