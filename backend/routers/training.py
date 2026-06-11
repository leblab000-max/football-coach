from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.exercise import Exercise
from pydantic import BaseModel
from typing import List
import random

router = APIRouter(prefix="/training", tags=["training"])

class TrainingRequest(BaseModel):
    age: int
    players: int
    duration: int
    goals: List[str]
    level: str = "medium"
    equipment: str = ""

@router.post("/generate")
def generate_training(request: TrainingRequest, db: Session = Depends(get_db)):
    all_exercises = db.query(Exercise).filter(
        Exercise.age_min <= request.age,
        Exercise.age_max >= request.age
    ).all()

    if not all_exercises:
        all_exercises = db.query(Exercise).all()

    def pick(count):
        if len(all_exercises) >= count:
            return random.sample(all_exercises, count)
        return all_exercises

    warmup_time = int(request.duration * 0.15)
    main_time = int(request.duration * 0.50)
    game_time = int(request.duration * 0.25)
    cooldown_time = request.duration - warmup_time - main_time - game_time

    return {
        "duration": request.duration,
        "age": request.age,
        "players": request.players,
        "goals": request.goals,
        "warmup": {
            "duration": warmup_time,
            "exercises": [{"id": e.id, "name": e.name, "category": e.category,
                "duration": warmup_time, "description": e.description,
                "equipment": e.equipment} for e in pick(2)]
        },
        "main": {
            "duration": main_time,
            "exercises": [{"id": e.id, "name": e.name, "category": e.category,
                "duration": main_time // 2, "description": e.description,
                "equipment": e.equipment} for e in pick(3)]
        },
        "game": {
            "duration": game_time,
            "exercises": [{"id": e.id, "name": e.name, "category": e.category,
                "duration": game_time, "description": e.description,
                "equipment": e.equipment} for e in pick(1)]
        },
        "cooldown": {
            "duration": cooldown_time,
            "exercises": [{"id": e.id, "name": e.name, "category": e.category,
                "duration": cooldown_time, "description": e.description,
                "equipment": e.equipment} for e in pick(1)]
        }
    }